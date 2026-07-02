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
  const rawServices = data.services || [];
  const rawAppointments = data.appointments || [];

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
    imageUrl: s.image_url || "",
    category: s.category || "",
    description: s.description || ""
  }));

  const appointments = rawAppointments.map((a: any) => ({
    id: a.id,
    clientName: a.client_name,
    clientPhone: a.client_phone || "",
    clientEmail: a.client_email || "",
    serviceId: a.service_id,
    serviceName: services.find((s: any) => s.id === a.service_id)?.name || "Service",
    date: a.date,
    time: a.time,
    status: a.status,
    screenshotName: a.deposit_receipt_url,
    paymentMethod: "N/A", 
    amountPaid: "N/A", 
    createdAt: a.created_at,
  }));

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
