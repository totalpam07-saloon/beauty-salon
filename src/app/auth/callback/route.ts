import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const isLocal = rootDomain.includes("localhost");
  const scheme = isLocal ? "http" : "https";

  // Check if superadmin
  const { data: superadmin } = await supabase
    .from("superadmins")
    .select("id")
    .eq("user_id", data.user.id)
    .single();

  if (superadmin) {
    return NextResponse.redirect(`${scheme}://${rootDomain}/superadmin`);
  }

  // Check if salon owner
  const { data: tenant } = await supabase
    .from("tenants")
    .select("subdomain")
    .eq("owner_id", data.user.id)
    .single();

  if (tenant) {
    return NextResponse.redirect(`${scheme}://${tenant.subdomain}.${rootDomain}/admin`);
  }

  // No role → send to signup
  return NextResponse.redirect(`${scheme}://${rootDomain}/signup`);
}
