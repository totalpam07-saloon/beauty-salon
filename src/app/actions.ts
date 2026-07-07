"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
    template_id: newSettings.templateId,
  }).eq("tenant_id", tenantId);

  revalidatePath("/", "layout");
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

  revalidatePath("/", "layout");
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

  revalidatePath("/", "layout");
}

export async function deleteServiceAction(tenantId: string, domain: string, id: string) {
  const supabase = await verifyAuth(tenantId);
  await supabase.from("services").delete().eq("id", id).eq("tenant_id", tenantId);
  revalidatePath("/", "layout");
}

export async function addStaffAction(tenantId: string, domain: string, staff: any) {
  const supabase = await verifyAuth(tenantId);
  await supabase.from("staff").insert({
    tenant_id: tenantId,
    name: staff.name,
    role: staff.role,
    image_url: staff.imageUrl,
  });
  revalidatePath("/", "layout");
}

export async function updateStaffAction(tenantId: string, domain: string, id: string, updated: any) {
  const supabase = await verifyAuth(tenantId);
  const dbUpdate: any = {};
  if (updated.name !== undefined) dbUpdate.name = updated.name;
  if (updated.role !== undefined) dbUpdate.role = updated.role;
  if (updated.imageUrl !== undefined) dbUpdate.image_url = updated.imageUrl;

  if (Object.keys(dbUpdate).length > 0) {
    await supabase.from("staff").update(dbUpdate).eq("id", id).eq("tenant_id", tenantId);
  }
  revalidatePath("/", "layout");
}

export async function deleteStaffAction(tenantId: string, domain: string, id: string) {
  const supabase = await verifyAuth(tenantId);
  await supabase.from("staff").delete().eq("id", id).eq("tenant_id", tenantId);
  revalidatePath("/", "layout");
}

export async function updateClientNotesAction(tenantId: string, domain: string, phone: string, name: string, email: string, privateNotes: string) {
  const supabase = await verifyAuth(tenantId);
  // Upsert the client based on phone and tenant_id
  await supabase.from("clients").upsert(
    {
      tenant_id: tenantId,
      phone,
      name,
      email,
      private_notes: privateNotes
    },
    { onConflict: 'tenant_id, phone' }
  );
  revalidatePath("/", "layout");
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
  revalidatePath("/", "layout");
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
  revalidatePath("/", "layout");
}

export async function deletePortfolioPhotoAction(tenantId: string, domain: string, id: string) {
  const supabase = await verifyAuth(tenantId);
  await supabase.from("portfolio").delete().eq("id", id).eq("tenant_id", tenantId);
  revalidatePath("/", "layout");
}

export async function updateAppointmentStatusAction(tenantId: string, domain: string, id: string, status: string) {
  const supabase = await verifyAuth(tenantId);
  await supabase.from("appointments").update({ status }).eq("id", id).eq("tenant_id", tenantId);
  revalidatePath("/", "layout");
}

// Public action - anyone can book an appointment
export async function addAppointmentAction(tenantId: string, domain: string, appointment: any) {
  const supabase = await createClient(); // No auth required for public bookings
  
  await supabase.from("appointments").insert({
    tenant_id: tenantId,
    service_id: appointment.serviceId,
    staff_id: appointment.staffId === "any" ? null : appointment.staffId,
    date: appointment.date,
    time: appointment.time,
    client_name: appointment.clientName,
    client_phone: appointment.clientPhone,
    client_email: appointment.clientEmail,
    deposit_receipt_url: appointment.screenshotName,
    status: appointment.status,
  });
  revalidatePath("/", "layout");
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
  revalidatePath("/", "layout");
}

export async function updateTenantDomainAction(tenantId: string, domain: string, newDomain: string | null) {
  const supabase = await verifyAuth(tenantId);
  await supabase.from("tenants").update({ domain: newDomain }).eq("id", tenantId);
  revalidatePath("/", "layout");
}

// Public action - anyone with a magic link can leave a review
export async function addReviewAction(
  tenantId: string, 
  appointmentId: string, 
  rating: number, 
  comment: string, 
  media: { url: string; type: 'image' | 'video' }[], 
  isAnonymous: boolean
) {
  const supabase = await createClient();
  
  const { data: existing } = await supabase.from("reviews").select("id").eq("appointment_id", appointmentId).single();
  
  const payload = {
    tenant_id: tenantId,
    appointment_id: appointmentId,
    rating,
    comment,
    media,
    is_anonymous: isAnonymous
  };

  if (existing) {
    await supabase.from("reviews").update(payload).eq("id", existing.id);
  } else {
    await supabase.from("reviews").insert(payload);
  }
  
  revalidatePath("/", "layout");
}

export async function likeMediaAction(reviewId: string, mediaId: string) {
  const supabase = await createClient();
  
  const { data: review } = await supabase.from("reviews").select("media").eq("id", reviewId).single();
  if (review && review.media && Array.isArray(review.media)) {
    const updatedMedia = review.media.map((m: any) => {
      if (m.id === mediaId) {
        return { ...m, likes: (m.likes || 0) + 1 };
      }
      return m;
    });
    await supabase.from("reviews").update({ media: updatedMedia }).eq("id", reviewId);
    revalidatePath("/", "layout");
  }
}

export async function unlikeMediaAction(reviewId: string, mediaId: string) {
  const supabase = await createClient();
  
  const { data: review } = await supabase.from("reviews").select("media").eq("id", reviewId).single();
  if (review && review.media && Array.isArray(review.media)) {
    const updatedMedia = review.media.map((m: any) => {
      if (m.id === mediaId) {
        const currentLikes = m.likes || 0;
        return { ...m, likes: currentLikes > 0 ? currentLikes - 1 : 0 };
      }
      return m;
    });
    await supabase.from("reviews").update({ media: updatedMedia }).eq("id", reviewId);
    revalidatePath("/", "layout");
  }
}
