import { notFound } from "next/navigation";
import { getTenantIdByDomain, getTenantData } from "@/lib/supabase/tenant-data";
import ClientServicesManager from "./ClientServicesManager";

export default async function ServicesPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const rawDomain = decodeURIComponent(params.domain);
  const domain = rawDomain.replace(/\.localhost:\d+$/, "").replace(/\.\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\.nip\.io)?(:\d+)?$/, "");

  const tenantId = await getTenantIdByDomain(domain);
  if (!tenantId) notFound();

  const data = await getTenantData(tenantId);
  
  if (!data) notFound();

  const rawServices = data.services || [];

  const services = rawServices.map((s: any) => ({
    id: s.id,
    name: s.name,
    priceUSD: s.price_usd,
    priceHTG: s.price_htg,
    depositType: s.deposit_type,
    depositPercentage: s.deposit_percentage,
    depositFixedUSD: s.deposit_fixed_usd,
    depositFixedHTG: s.deposit_fixed_htg,
    duration: s.duration,
    imageUrl: s.image_url,
    category: s.category,
    description: s.description
  }));

  return (
    <ClientServicesManager 
      tenantId={tenantId}
      domain={domain}
      services={services} 
    />
  );
}
