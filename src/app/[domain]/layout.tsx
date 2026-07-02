import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TenantProvider } from "@/components/tenant-provider";
import { Toasts } from "@/components/Toasts";
import { createClient } from "@/lib/supabase/server";
import { getTenantIdByDomain, getTenantData } from "@/lib/supabase/tenant-data";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import type { Metadata } from "next";

// Strips the local dev suffix from the domain param (e.g. "demo.localhost:3000" → "demo")
function extractSubdomain(rawDomain: string): string {
  return decodeURIComponent(rawDomain)
    .replace(/\.localhost(:\d+)?$/, "")
    .replace(/\.\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\.nip\.io)?(:\d+)?$/, "");
}

export async function generateMetadata(
  props: { params: Promise<{ domain: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const domain = extractSubdomain(params.domain);

  const tenantId = await getTenantIdByDomain(domain);
  if (!tenantId) return { title: "Non trouvé" };

  const tenantData = await getTenantData(tenantId);
  const settings = tenantData?.salon_settings?.[0];

  if (!settings) return { title: "Salon de Beauté" };

  return {
    title: settings.salonName || "Salon de Beauté",
    description: settings.description || "Réservez votre rendez-vous de beauté.",
    openGraph: {
      title: settings.salonName,
      description: settings.description || "Réservez votre rendez-vous de beauté.",
      images: settings.logoUrl ? [{ url: settings.logoUrl }] : [],
    },
  };
}

export default async function TenantLayout(props: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const params = await props.params;
  const domain = extractSubdomain(params.domain);

  // 1. Look up tenant by subdomain (single source of truth)
  const tenantId = await getTenantIdByDomain(domain);
  if (!tenantId) notFound();

  const supabase = await createClient();

  // 2. Check Subscription Status & Expiration
  const { data: tenantRecord } = await supabase
    .from("tenants")
    .select("subscription_status, plan_expires_at")
    .eq("id", tenantId)
    .single();

  const isAutoSuspended = tenantRecord?.plan_expires_at &&
    new Date() > new Date(new Date(tenantRecord.plan_expires_at).getTime() + 72 * 60 * 60 * 1000);

  if (tenantRecord?.subscription_status === "locked" || isAutoSuspended) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 text-center">
        <div className="bg-card border-2 border-red-500 rounded-3xl p-8 max-w-md w-full shadow-xl">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-black text-foreground mb-2">Site Indisponible</h1>
          <p className="text-foreground/70">
            Ce salon de beauté est temporairement suspendu. Veuillez contacter l'administrateur.
          </p>
          {isAutoSuspended && <p className="text-red-500 font-bold mt-4 text-sm">Raison: Abonnement expiré.</p>}
        </div>
      </div>
    );
  }

  // 3. Fetch all data in a SINGLE relational query
  const tenantData = await getTenantData(tenantId);

  const settings = tenantData?.salon_settings?.[0];
  const services = tenantData?.services || [];
  const appointments = tenantData?.appointments || [];
  const portfolio = tenantData?.portfolio || [];

  // Convert DB snake_case to frontend camelCase
  const formattedSettings = settings ? {
    salonName: settings.salon_name,
    monCashNumber: settings.moncash_number || "",
    natCashNumber: settings.natcash_number || "",
    zelleInfo: settings.zelle_info || "",
    cashAppInfo: settings.cashapp_info || "",
    paypalInfo: settings.paypal_info || "",
    logoUrl: settings.logo_url || "",
    bannerUrl: settings.banner_url || "",
    headerDisplay: settings.header_display || "both",
    bufferMinutes: settings.buffer_minutes || 30,
    showAvailability: settings.show_availability !== false,
    workingHours: settings.working_hours,
    theme: settings.theme || "soft",
    customThemeColor: settings.custom_theme_color || "#E8A598",
    instagramUrl: settings.instagram_url || "",
    facebookUrl: settings.facebook_url || "",
    tiktokUrl: settings.tiktok_url || "",
    whatsappNumber: settings.whatsapp_number || "",
    address: settings.address || "",
    whatsappVisibility: settings.whatsapp_visibility || "floating",
  } : null;

  const formattedServices = (services || []).map((s: any) => ({
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

  const formattedAppointments = (appointments || []).map((a: any) => ({
    id: a.id,
    clientName: a.client_name,
    clientPhone: a.client_phone || "",
    clientEmail: a.client_email || "",
    serviceId: a.service_id,
    serviceName: formattedServices.find(s => s.id === a.service_id)?.name || "Service",
    date: a.date,
    time: a.time,
    status: a.status,
    screenshotName: a.deposit_receipt_url,
    paymentMethod: "N/A", // Deprecated field
    amountPaid: "N/A", // Deprecated field
    createdAt: a.created_at,
  }));

  const formattedPortfolio = (portfolio || []).map((p: any) => ({
    id: p.id,
    imageUrl: p.image_url,
    category: p.category || "",
    caption: p.caption || "",
    instagramUrl: p.ig_link || "",
    createdAt: p.created_at,
  }));

  const isCustomTheme = formattedSettings?.theme === "custom";
  const customColor = formattedSettings?.customThemeColor || "#E8A598";
  
  // For standard themes, we set data-theme. For custom, we inject CSS vars via a style tag.
  const themeProps = isCustomTheme ? { "data-theme": "custom" } : { "data-theme": formattedSettings?.theme || "soft" };

  return (
    <TenantProvider
      tenantId={tenantId}
      planExpiresAt={tenantRecord?.plan_expires_at || null}
      settings={formattedSettings}
    >
      <div {...themeProps} className="min-h-screen bg-background text-foreground transition-colors">
        {isCustomTheme && (
          <style dangerouslySetInnerHTML={{ __html: `
            [data-theme="custom"] {
              --primary: ${customColor};
              --background: color-mix(in srgb, var(--primary) 5%, white);
              --foreground: color-mix(in srgb, var(--primary) 80%, black);
              --secondary: color-mix(in srgb, var(--primary) 15%, white);
              --border: color-mix(in srgb, var(--primary) 20%, white);
              --card: #ffffff;
              --accent: color-mix(in srgb, var(--primary) 40%, black);
              --primary-foreground: #ffffff; /* Assumes dark primary, can be improved later */
            }
          `}} />
        )}
        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar 
            settings={formattedSettings} 
            pendingAppointmentsCount={formattedAppointments?.filter((a: any) => a.status === "pending").length || 0}
            planExpiresAt={tenantRecord?.plan_expires_at || null}
          />
          <main className="flex-1 flex flex-col">
            {props.children}
          </main>
          <Footer settings={formattedSettings} />
        </div>
        {formattedSettings?.whatsappVisibility === "floating" && formattedSettings?.whatsappNumber && (
          <a href={`https://wa.me/${formattedSettings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" 
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 animate-in slide-in-from-bottom-5">
            <MessageCircle size={28} />
          </a>
        )}
        <Toasts />
      </div>
    </TenantProvider>
  );
}
