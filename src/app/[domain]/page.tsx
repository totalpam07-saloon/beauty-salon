import { notFound } from "next/navigation";
import { getTenantIdByDomain, getCachedTenantData } from "@/lib/supabase/tenant-data";
import ClientHome from "./ClientHome";

export default async function HomePage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const rawDomain = decodeURIComponent(params.domain);
  const domain = rawDomain.replace(/\.localhost:\d+$/, "").replace(/\.\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\.nip\.io)?(:\d+)?$/, "");

  const tenantId = await getTenantIdByDomain(domain);
  if (!tenantId) notFound();

  const fetcher = getCachedTenantData(domain);
  const data = await fetcher(tenantId);
  
  if (!data) notFound();

  const settings = data.salon_settings?.[0];
  const services = data.services || [];
  const portfolio = data.portfolio || [];

  if (!settings) notFound();

  return (
    <ClientHome 
      services={services} 
      settings={settings} 
      portfolio={portfolio} 
    />
  );
}
