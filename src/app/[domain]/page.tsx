import { notFound } from "next/navigation";
import { getTenantIdByDomain, getTenantData } from "@/lib/supabase/tenant-data";
import ClientHome from "./ClientHome";

export default async function HomePage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const rawDomain = decodeURIComponent(params.domain);
  const domain = rawDomain.replace(/\.localhost:\d+$/, "").replace(/\.\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\.nip\.io)?(:\d+)?$/, "");

  const tenantId = await getTenantIdByDomain(domain);
  if (!tenantId) notFound();

  const data = await getTenantData(tenantId);
  
  if (!data) notFound();

  const rawSettings = data.salon_settings?.[0];
  const rawServices = data.services || [];
  const rawPortfolio = data.portfolio || [];

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
    priceUSD: s.price_usd || 0,
    priceHTG: s.price_htg || 0,
    depositType: s.deposit_type,
    depositPercentage: s.deposit_percentage || 0,
    depositFixedUSD: s.deposit_fixed_usd || 0,
    depositFixedHTG: s.deposit_fixed_htg || 0,
    duration: s.duration,
    imageUrl: s.image_url,
    category: s.category,
    description: s.description
  }));

  const portfolio = rawPortfolio.map((p: any) => ({
    id: p.id,
    imageUrl: p.image_url,
    category: p.category,
    caption: p.caption,
    instagramUrl: p.ig_link,
    createdAt: p.created_at
  }));

  const rawReviews = data.reviews || [];
  const reviews = rawReviews.map((r: any) => ({
    id: r.id,
    tenantId: r.tenant_id,
    appointmentId: r.appointment_id,
    rating: r.rating,
    comment: r.comment,
    imageUrl: r.image_url,
    videoUrl: r.video_url,
    isAnonymous: r.is_anonymous,
    createdAt: r.created_at
  }));

  // We need the client name for non-anonymous reviews
  // We can join this from appointments
  const rawAppointments = data.appointments || [];
  const reviewsWithClientNames = reviews.map((r: any) => {
    const apt = rawAppointments.find((a: any) => a.id === r.appointmentId);
    return {
      ...r,
      clientName: apt ? apt.client_name : "Client(e)",
      serviceName: apt ? services.find((s: any) => s.id === apt.service_id)?.name : "Service"
    };
  });

  return (
    <ClientHome 
      services={services} 
      settings={settings} 
      portfolio={portfolio} 
      reviews={reviewsWithClientNames}
    />
  );
}
