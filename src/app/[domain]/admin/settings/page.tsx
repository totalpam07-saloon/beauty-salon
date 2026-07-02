import { notFound } from "next/navigation";
import { getTenantIdByDomain, getCachedTenantData } from "@/lib/supabase/tenant-data";
import { createClient } from "@/lib/supabase/server";
import ClientSettingsManager from "./ClientSettingsManager";

export default async function SettingsPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const rawDomain = decodeURIComponent(params.domain);
  const domain = rawDomain.replace(/\.localhost:\d+$/, "").replace(/\.\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\.nip\.io)?(:\d+)?$/, "");

  const tenantId = await getTenantIdByDomain(domain);
  if (!tenantId) notFound();

  const fetcher = getCachedTenantData(domain);
  const data = await fetcher(tenantId);
  
  if (!data || !data.salon_settings?.[0]) notFound();

  const settings = data.salon_settings[0];
  
  const supabase = await createClient();
  const { data: tenant } = await supabase.from("tenants").select("domain").eq("id", tenantId).single();
  const customDomain = tenant?.domain || "";

  // Fetch payments
  const { data: tenantPayments } = await supabase
    .from("tenant_payments")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  return (
    <ClientSettingsManager 
      tenantId={tenantId}
      domain={domain}
      settings={settings}
      customDomainServer={customDomain}
      tenantPayments={tenantPayments || []}
    />
  );
}
