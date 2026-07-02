import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClientLayout from "./ClientLayout";
import { headers } from "next/headers";

export default async function AdminServerLayout(props: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const isLocal = rootDomain.includes("localhost");

  // 1. Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    // MUST use absolute URL — a relative redirect("/login") from the [domain] route
    // resolves to babas.localhost:3000/login which 404s (no login page there).
    const reqHeaders = await headers();
    const scheme = reqHeaders.get("x-forwarded-proto") === "https" ? "https" : "http";
    redirect(`${scheme}://${rootDomain}/login`);
  }

  // 2. Fetch Tenant info based on subdomain
  const rawDomain = decodeURIComponent(params.domain);
  const domain = rawDomain.replace(".localhost:3000", "");

  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("owner_id")
    .eq("subdomain", domain)
    .single();

  if (tenantError || !tenant) {
    redirect("/"); // Not a valid tenant
  }

  // 3. Verify Ownership
  if (tenant.owner_id !== user.id) {
    // Check if user is a superadmin
    const { data: superadmin } = await supabase
      .from("superadmins")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!superadmin) {
      const reqHeaders = await headers();
      const scheme = reqHeaders.get("x-forwarded-proto") === "https" ? "https" : "http";
      redirect(`${scheme}://${rootDomain}/superadmin`);
    }
  }

  return <ClientLayout>{props.children}</ClientLayout>;
}
