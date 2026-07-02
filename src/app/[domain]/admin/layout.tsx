import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTenantIdByDomain } from "@/lib/supabase/tenant-data";
import ClientLayout from "./ClientLayout";
import { headers } from "next/headers";

// Same helper as [domain]/layout.tsx — single source of truth
function extractSubdomain(rawDomain: string): string {
  return decodeURIComponent(rawDomain)
    .replace(/\.localhost(:\d+)?$/, "")
    .replace(/\.\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\.nip\.io)?(:\d+)?$/, "");
}

export default async function AdminServerLayout(props: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

  // 1. Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    const reqHeaders = await headers();
    const scheme = reqHeaders.get("x-forwarded-proto") === "https" ? "https" : "http";
    redirect(`${scheme}://${rootDomain}/login`);
  }

  // 2. Look up tenant by subdomain (consistent with domain layout)
  const domain = extractSubdomain(params.domain);
  const tenantId = await getTenantIdByDomain(domain);

  if (!tenantId) {
    redirect("/"); // Not a valid tenant
  }

  // 3. Verify Ownership or Superadmin access
  const { data: tenant } = await supabase
    .from("tenants")
    .select("owner_id")
    .eq("id", tenantId)
    .single();

  if (!tenant) redirect("/");

  if (tenant.owner_id !== user.id) {
    const { data: superadmin } = await supabase
      .from("superadmins")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!superadmin) {
      const reqHeaders = await headers();
      const scheme = reqHeaders.get("x-forwarded-proto") === "https" ? "https" : "http";
      redirect(`${scheme}://${rootDomain}/login`);
    }
  }

  return <ClientLayout>{props.children}</ClientLayout>;
}
