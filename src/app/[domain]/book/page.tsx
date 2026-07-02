import { notFound } from "next/navigation";
import { getTenantIdByDomain, getTenantData } from "@/lib/supabase/tenant-data";
import ClientBookingFlow from "./ClientBookingFlow";

export default async function BookPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const rawDomain = decodeURIComponent(params.domain);
  const domain = rawDomain.replace(/\.localhost:\d+$/, "").replace(/\.\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\.nip\.io)?(:\d+)?$/, "");

  const tenantId = await getTenantIdByDomain(domain);
  if (!tenantId) notFound();

  const data = await getTenantData(tenantId);
  
  if (!data) notFound();

  const settings = data.salon_settings?.[0];
  const services = data.services || [];
  
  // SECURE SANITIZATION: Strip PII from appointments before passing to public client
  const appointments = (data.appointments || []).map((a: any) => ({
    id: a.id,
    date: a.date,
    time: a.time,
    serviceId: a.service_id,
    status: a.status
  }));

  if (!settings) notFound();

  return (
    <ClientBookingFlow 
      tenantId={tenantId}
      domain={domain}
      services={services} 
      settings={settings} 
      appointments={appointments} 
    />
  );
}
