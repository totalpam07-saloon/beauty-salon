import { notFound } from "next/navigation";
import { getTenantIdByDomain, getTenantData } from "@/lib/supabase/tenant-data";
import ClientPortfolioManager from "./ClientPortfolioManager";

export default async function PortfolioPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const rawDomain = decodeURIComponent(params.domain);
  const domain = rawDomain.replace(/\.localhost:\d+$/, "").replace(/\.\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\.nip\.io)?(:\d+)?$/, "");

  const tenantId = await getTenantIdByDomain(domain);
  if (!tenantId) notFound();

  const data = await getTenantData(tenantId);
  
  if (!data) notFound();

  const rawPortfolio = data.portfolio || [];
  const rawServices = data.services || [];

  const portfolio = rawPortfolio.map((p: any) => ({
    id: p.id,
    imageUrl: p.image_url,
    category: p.category,
    caption: p.caption,
    instagramUrl: p.ig_link,
    createdAt: p.created_at
  }));

  const services = rawServices.map((s: any) => ({
    id: s.id,
    name: s.name,
    priceUSD: s.price_usd,
    priceHTG: s.price_htg,
    depositType: s.deposit_type,
    depositPercentage: s.deposit_percentage || 0,
    depositFixedUSD: s.deposit_fixed_usd || 0,
    depositFixedHTG: s.deposit_fixed_htg || 0,
    duration: s.duration,
    imageUrl: s.image_url,
    category: s.category,
    description: s.description
  }));

  return (
    <ClientPortfolioManager 
      tenantId={tenantId}
      domain={domain}
      portfolio={portfolio} 
      services={services}
    />
  );
}
