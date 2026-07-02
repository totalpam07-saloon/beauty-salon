import { notFound } from "next/navigation";
import { getTenantIdByDomain, getCachedTenantData } from "@/lib/supabase/tenant-data";
import ClientPortfolioManager from "./ClientPortfolioManager";

export default async function PortfolioPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const rawDomain = decodeURIComponent(params.domain);
  const domain = rawDomain.replace(/\.localhost:\d+$/, "").replace(/\.\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\.nip\.io)?(:\d+)?$/, "");

  const tenantId = await getTenantIdByDomain(domain);
  if (!tenantId) notFound();

  const fetcher = getCachedTenantData(domain);
  const data = await fetcher(tenantId);
  
  if (!data) notFound();

  const portfolio = data.portfolio || [];
  const services = data.services || [];

  return (
    <ClientPortfolioManager 
      tenantId={tenantId}
      domain={domain}
      portfolio={portfolio} 
      services={services}
    />
  );
}
