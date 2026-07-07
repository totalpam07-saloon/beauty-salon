import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. Static files (e.g. favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  // ─── 1. Determine the root domain ───────────────────────────────────────
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "crochetri.store";
  const rawHost = req.headers.get("host") ?? "";
  const host = rawHost.replace(/^www\./, ""); // Strip www. so www.crochetri.store == crochetri.store

  // ─── 2. Refresh the Supabase session cookie ─────────────────────────────
  const { supabaseResponse, user, supabase } = await updateSession(req, NextResponse.next());

  // ─── 3. Classify the request ────────────────────────────────────────────
  // isMainDomain = the root landing page (localhost:3000 or yourdomain.com)
  const isMainDomain =
    host === rootDomain ||
    host === "localhost:3000" ||
    /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(host); // bare IP

  // Extract the subdomain (e.g. "demo" from "demo.localhost:3000")
  const subdomain = host.replace(`.${rootDomain}`, "").replace(".localhost:3000", "");

  // ─── 4. Protect /superadmin ─────────────────────────────────────────────
  if (isMainDomain && path.startsWith("/superadmin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const { data: superadmin } = await supabase
      .from("superadmins")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!superadmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ─── 5. Protect /admin on subdomains ────────────────────────────────────
  if (!isMainDomain && path.startsWith("/admin") && !user) {
    const scheme = req.url.startsWith("https") ? "https" : "http";
    return NextResponse.redirect(new URL(`${scheme}://${rootDomain}/login`));
  }

  // ─── 6. Pass main domain requests straight through ───────────────────────
  if (isMainDomain) {
    return supabaseResponse;
  }

  // ─── 7. Rewrite subdomain requests to the [domain] folder ────────────────
  // e.g. demo.localhost:3000/admin → /demo/admin
  const rewriteUrl = req.nextUrl.clone();
  rewriteUrl.pathname = `/${subdomain}${path}`;
  const rewriteResponse = NextResponse.rewrite(rewriteUrl);

  // Copy session cookies to the rewrite response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    rewriteResponse.cookies.set(cookie.name, cookie.value);
  });

  return rewriteResponse;
}
