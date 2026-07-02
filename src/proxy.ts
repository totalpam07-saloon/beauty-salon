import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${rootDomain}`);

  // Helper function to force an absolute cross-domain redirect.
  // Next.js middleware sometimes strips the origin if it matches req.url (which is always localhost:3000 locally),
  // causing an infinite loop. Using an HTML meta refresh safely bypasses this.
  const forceRedirect = (url: string) => {
    return new NextResponse(
      `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${url}" /></head><body>Redirecting to <a href="${url}">${url}</a>...</body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  };

  // special case for Vercel preview deployment URLs
  if (
    hostname.includes("---") &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split("---")[0]}.${rootDomain}`;
  }

  // Get the path of the request (e.g. /book)
  const path = url.pathname;
  
  // Verify session and refresh cookies
  const { supabaseResponse, user, supabase } = await updateSession(req, NextResponse.next());

  // Route protection
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(hostname);
  const isLocalRoot = hostname === "localhost:3000" || isIpAddress;
  const isProdRoot = hostname === rootDomain;
  const isMainDomain = isLocalRoot || isProdRoot;

  // Protect /superadmin on main domain
  if (isMainDomain && path.startsWith("/superadmin")) {
    if (!user) {
      const scheme = req.url.startsWith("https") ? "https" : "http";
      const targetDomain = isLocalRoot ? hostname : rootDomain;
      return forceRedirect(`${scheme}://${targetDomain}/login`);
    }
    // Check if user is in superadmins table
    const { data: superadmin } = await supabase
      .from('superadmins')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!superadmin) {
      const scheme = req.url.startsWith("https") ? "https" : "http";
      const targetDomain = isLocalRoot ? hostname : rootDomain;
      return forceRedirect(`${scheme}://${targetDomain}/`);
    }
  }

  // Redirect subdomain /login and /signup to the main domain login page.
  // The [domain] folder has no login page, so we must always bounce here.
  if (!isMainDomain && (path === "/login" || path === "/signup")) {
    const scheme = req.url.startsWith("https") ? "https" : "http";
    // For local subdomains, we want to redirect to the base root IP/localhost
    // We can compute the base domain by stripping the subdomain from hostname
    let baseRoot = rootDomain;
    if (isLocalRoot || hostname.includes("localhost") || hostname.includes("nip.io")) {
       const parts = hostname.split(".");
       if (hostname.includes("nip.io")) {
           baseRoot = parts.slice(-6).join("."); // gets 192.168.x.x.nip.io:3000
       } else {
           baseRoot = parts.slice(-1).join("."); // gets localhost:3000
       }
    }
    return forceRedirect(`${scheme}://${baseRoot}${path}`);
  }

  // Allow /auth/* through on subdomains (used for token handoff set-session)
  if (!isMainDomain && path.startsWith("/auth/")) {
    const rewriteResponse = NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
    supabaseResponse.cookies.getAll().forEach(cookie => {
      rewriteResponse.cookies.set(cookie.name, cookie.value);
    });
    return rewriteResponse;
  }

  // Protect /[domain]/admin on subdomains — no session → send to main domain login
  if (!isMainDomain && path.startsWith("/admin") && !user) {
    const scheme = req.url.startsWith("https") ? "https" : "http";
    
    let baseRoot = rootDomain;
    if (isLocalRoot || hostname.includes("localhost") || hostname.includes("nip.io")) {
       const parts = hostname.split(".");
       if (hostname.includes("nip.io")) {
           baseRoot = parts.slice(-6).join(".");
       } else {
           baseRoot = parts.slice(-1).join(".");
       }
    }
    return forceRedirect(`${scheme}://${baseRoot}/login`);
  }

  if (isMainDomain) {
    return supabaseResponse;
  }

  // Rewrite to the `[domain]` dynamic route for all tenants (subdomains or custom domains)
  const rewriteResponse = NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
  
  // Copy cookies from supabaseResponse to rewriteResponse to maintain session
  supabaseResponse.cookies.getAll().forEach(cookie => {
    rewriteResponse.cookies.set(cookie.name, cookie.value);
  });
  
  return rewriteResponse;
}
