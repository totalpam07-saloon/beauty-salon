import { notFound } from "next/navigation";
import { getTenantIdByDomain, getTenantData } from "@/lib/supabase/tenant-data";
import ClientAdminDashboard from "./ClientAdminDashboard";

export default async function AdminDashboardPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const rawDomain = decodeURIComponent(params.domain);
  const domain = rawDomain.replace(/\.localhost:\d+$/, "").replace(/\.\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\.nip\.io)?(:\d+)?$/, "");

  const tenantId = await getTenantIdByDomain(domain);
  if (!tenantId) notFound();

  const data = await getTenantData(tenantId);
  
  if (!data) notFound();

  const settings = data.salon_settings?.[0];
  const services = data.services || [];
  const appointments = data.appointments || [];

  if (!settings) notFound();

  return (
    <ClientAdminDashboard 
      tenantId={tenantId}
      domain={domain}
      services={services} 
      settings={settings} 
      appointments={appointments} 
    />
  );
}
