"use server";

import { createClient } from "@/lib/supabase/server";

// Helper to verify auth and ownership
async function verifyAuth(tenantId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Not authenticated");

  const { data: tenant } = await supabase
    .from("tenants")
    .select("owner_id")
    .eq("id", tenantId)
    .single();

  if (!tenant) throw new Error("Tenant not found");

  if (tenant.owner_id !== user.id) {
    // Check if superadmin
    const { data: superadmin } = await supabase
      .from("superadmins")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!superadmin) throw new Error("Not authorized");
  }

  return supabase;
}

export async function updateSettingsAction(tenantId: string, domain: string, newSettings: any) {
  const supabase = await verifyAuth(tenantId);

  await supabase.from("salon_settings").update({
    salon_name: newSettings.salonName,
    logo_url: newSettings.logoUrl,
    banner_url: newSettings.bannerUrl,
    description: newSettings.description,
    header_display: newSettings.headerDisplay,
    moncash_number: newSettings.monCashNumber,
    natcash_number: newSettings.natCashNumber,
    zelle_info: newSettings.zelleInfo,
    cashapp_info: newSettings.cashAppInfo,
    paypal_info: newSettings.paypalInfo,
    working_hours: newSettings.workingHours,
    buffer_minutes: newSettings.bufferMinutes,
    show_availability: newSettings.showAvailability,
    theme: newSettings.theme,
    custom_theme_color: newSettings.customThemeColor,
    instagram_url: newSettings.instagramUrl,
    facebook_url: newSettings.facebookUrl,
    tiktok_url: newSettings.tiktokUrl,
    whatsapp_number: newSettings.whatsappNumber,
    address: newSettings.address,
    whatsapp_visibility: newSettings.whatsappVisibility,
  }).eq("tenant_id", tenantId);
}

export async function addServiceAction(tenantId: string, domain: string, service: any) {
  const supabase = await verifyAuth(tenantId);

  await supabase.from("services").insert({
    tenant_id: tenantId,
    name: service.name,
    price_usd: service.priceUSD,
    price_htg: service.priceHTG,
    deposit_type: service.depositType,
    deposit_percentage: service.depositPercentage,
    deposit_fixed_usd: service.depositFixedUSD,
    deposit_fixed_htg: service.depositFixedHTG,
    duration: service.duration,
    image_url: service.imageUrl,
    category: service.category,
    description: service.description
  });
}

export async function updateServiceAction(tenantId: string, domain: string, id: string, updated: any) {
  const supabase = await verifyAuth(tenantId);

  const dbUpdate: any = {};
  if (updated.name !== undefined) dbUpdate.name = updated.name;
  if (updated.priceUSD !== undefined) dbUpdate.price_usd = updated.priceUSD;
  if (updated.priceHTG !== undefined) dbUpdate.price_htg = updated.priceHTG;
  if (updated.depositType !== undefined) dbUpdate.deposit_type = updated.depositType;
  if (updated.depositPercentage !== undefined) dbUpdate.deposit_percentage = updated.depositPercentage;
  if (updated.depositFixedUSD !== undefined) dbUpdate.deposit_fixed_usd = updated.depositFixedUSD;
  if (updated.depositFixedHTG !== undefined) dbUpdate.deposit_fixed_htg = updated.depositFixedHTG;
  if (updated.duration !== undefined) dbUpdate.duration = updated.duration;
  if (updated.imageUrl !== undefined) dbUpdate.image_url = updated.imageUrl;
  if (updated.category !== undefined) dbUpdate.category = updated.category;
  if (updated.description !== undefined) dbUpdate.description = updated.description;

  if (Object.keys(dbUpdate).length > 0) {
    await supabase.from("services").update(dbUpdate).eq("id", id).eq("tenant_id", tenantId);
  }
}

export async function deleteServiceAction(tenantId: string, domain: string, id: string) {
  const supabase = await verifyAuth(tenantId);
  await supabase.from("services").delete().eq("id", id).eq("tenant_id", tenantId);
}

export async function addPortfolioPhotoAction(tenantId: string, domain: string, photo: any) {
  const supabase = await verifyAuth(tenantId);
  await supabase.from("portfolio").insert({
    tenant_id: tenantId,
    image_url: photo.imageUrl,
    category: photo.category,
    caption: photo.caption,
    ig_link: photo.instagramUrl
  });
}

export async function updatePortfolioPhotoAction(tenantId: string, domain: string, id: string, updates: any) {
  const supabase = await verifyAuth(tenantId);
  
  const dbUpdate: any = {};
  if (updates.imageUrl !== undefined) dbUpdate.image_url = updates.imageUrl;
  if (updates.category !== undefined) dbUpdate.category = updates.category;
  if (updates.caption !== undefined) dbUpdate.caption = updates.caption;
  if (updates.instagramUrl !== undefined) dbUpdate.ig_link = updates.instagramUrl;

  if (Object.keys(dbUpdate).length > 0) {
    await supabase.from("portfolio").update(dbUpdate).eq("id", id).eq("tenant_id", tenantId);
  }
}

export async function deletePortfolioPhotoAction(tenantId: string, domain: string, id: string) {
  const supabase = await verifyAuth(tenantId);
  await supabase.from("portfolio").delete().eq("id", id).eq("tenant_id", tenantId);
}

export async function updateAppointmentStatusAction(tenantId: string, domain: string, id: string, status: string) {
  const supabase = await verifyAuth(tenantId);
  await supabase.from("appointments").update({ status }).eq("id", id).eq("tenant_id", tenantId);
}

// Public action - anyone can book an appointment
export async function addAppointmentAction(tenantId: string, domain: string, appointment: any) {
  const supabase = await createClient(); // No auth required for public bookings
  
  await supabase.from("appointments").insert({
    tenant_id: tenantId,
    service_id: appointment.serviceId,
    date: appointment.date,
    time: appointment.time,
    client_name: appointment.clientName,
    client_phone: appointment.clientPhone,
    client_email: appointment.clientEmail,
    deposit_receipt_url: appointment.screenshotName,
    status: appointment.status,
  });
}

export async function submitTenantPaymentAction(tenantId: string, domain: string, amount: number, currency: string, receiptUrl: string) {
  const supabase = await verifyAuth(tenantId);
  await supabase.from("tenant_payments").insert({
    tenant_id: tenantId,
    amount,
    currency,
    receipt_url: receiptUrl,
    status: "pending"
  });
}

export async function updateTenantDomainAction(tenantId: string, domain: string, newDomain: string | null) {
  const supabase = await verifyAuth(tenantId);
  await supabase.from("tenants").update({ domain: newDomain }).eq("id", tenantId);
}
