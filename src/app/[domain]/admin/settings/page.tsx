import { notFound } from "next/navigation";
import { getTenantIdByDomain, getTenantData } from "@/lib/supabase/tenant-data";
import { createClient } from "@/lib/supabase/server";
import ClientSettingsManager from "./ClientSettingsManager";

export default async function SettingsPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const rawDomain = decodeURIComponent(params.domain);
  const domain = rawDomain.replace(/\.localhost:\d+$/, "").replace(/\.\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\.nip\.io)?(:\d+)?$/, "");

  const tenantId = await getTenantIdByDomain(domain);
  if (!tenantId) notFound();

  const data = await getTenantData(tenantId);
  
  if (!data || !data.salon_settings?.[0]) notFound();

  const rawSettings = data.salon_settings[0];

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
