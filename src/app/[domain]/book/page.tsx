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

  const rawSettings = data.salon_settings?.[0];
  const rawServices = data.services || [];
  
  if (!rawSettings) notFound();

  const settings = {
    salonName: rawSettings.salon_name,
    monCashNumber: rawSettings.moncash_number || "",
    natCashNumber: rawSettings.natcash_number || "",
    zelleInfo: rawSettings.zelle_info || "",
    cashAppInfo: rawSettings.cashapp_info || "",
    paypalInfo: rawSettings.paypal_info || "",
    logoUrl: rawSettings.logo_url,
    bannerUrl: rawSettings.banner_url,
    description: rawSettings.description,
    headerDisplay: rawSettings.header_display,
    bufferMinutes: rawSettings.buffer_minutes,
    showAvailability: rawSettings.show_availability,
    workingHours: rawSettings.working_hours,
    theme: rawSettings.theme,
    customThemeColor: rawSettings.custom_theme_color,
    instagramUrl: rawSettings.instagram_url,
    facebookUrl: rawSettings.facebook_url,
    tiktokUrl: rawSettings.tiktok_url,
    whatsappNumber: rawSettings.whatsapp_number,
    address: rawSettings.address,
    whatsappVisibility: rawSettings.whatsapp_visibility,
  };

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
  
  // SECURE SANITIZATION: Strip PII from appointments before passing to public client
  const appointments = (data.appointments || []).map((a: any) => ({
    id: a.id,
    date: a.date,
    time: a.time,
    serviceId: a.service_id,
    status: a.status
  }));

  const staff = (data.staff || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    role: s.role,
    imageUrl: s.image_url
  }));

  if (!settings) notFound();

  return (
    <ClientBookingFlow 
      tenantId={tenantId}
      domain={domain}
      services={services} 
      settings={settings} 
      appointments={appointments}
      staffList={staff}
    />
  );
}
