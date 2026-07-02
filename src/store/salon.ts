import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { deleteImageFromUrl } from "@/lib/supabase/storage";

const supabase = createClient();

export type DepositType = "percentage" | "fixed";

export interface Service {
  id: string;
  name: string;
  priceUSD: number;
  priceHTG: number;
  depositType: DepositType;
  depositPercentage: number;
  depositFixedUSD: number;
  depositFixedHTG: number;
  duration: string;
  imageUrl?: string;
  category?: string;
  description?: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string; // Stored locally for convenience or fetched via join
  date: string;
  time: string;
  status: "pending" | "approved" | "rejected";
  screenshotName: string; // mapped to deposit_receipt_url
  screenshotData?: string; // used for preview
  paymentMethod: string;
  amountPaid: string;
  createdAt: string;
}

export interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
}

export interface SalonSettings {
  salonName: string;
  monCashNumber: string;
  natCashNumber: string;
  zelleInfo: string;
  cashAppInfo: string;
  paypalInfo: string;
  logoUrl?: string;
  bannerUrl?: string;
  description?: string;
  headerDisplay?: "logo" | "name" | "both";
  bufferMinutes: number;
  showAvailability: boolean;
  workingHours: {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
  };
  theme?: string;
  customThemeColor?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  whatsappNumber?: string;
  address?: string;
  whatsappVisibility?: "floating" | "inline" | "hidden";
}

export interface PortfolioPhoto {
  id: string;
  imageUrl: string;
  category: string;
  caption?: string;
  instagramUrl?: string;
  createdAt: string;
}

export interface TenantPayment {
  id: string;
  tenant_id: string;
  amount: number;
  currency: string;
  receipt_url: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  approved_at?: string;
}

interface SalonStore {
  tenantId: string | null;
  planExpiresAt: string | null;
  settings: SalonSettings | null;
  services: Service[];
  appointments: Appointment[];
  portfolio: PortfolioPhoto[];
  tenantPayments: TenantPayment[];
  
  // Initialization
  setStoreData: (data: { tenantId: string; planExpiresAt: string | null; settings: SalonSettings; services: Service[]; appointments: Appointment[]; portfolio: PortfolioPhoto[] }) => void;
  
  // Mutations
  updateSettings: (settings: Partial<SalonSettings>) => Promise<void>;
  addService: (service: Service) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addAppointment: (appointment: Appointment) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => Promise<void>;
  addPortfolioPhoto: (photo: PortfolioPhoto) => Promise<void>;
  deletePortfolioPhoto: (id: string) => Promise<void>;
  updatePortfolioPhoto: (id: string, updates: Partial<PortfolioPhoto>) => Promise<void>;

  fetchTenantPayments: () => Promise<void>;
  submitTenantPayment: (amount: number, currency: string, receiptUrl: string) => Promise<void>;
  
  // Toasts
  toasts: { id: string; message: string; type: "success" | "error" | "info" }[];
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
}

export const defaultWorkingHours: SalonSettings["workingHours"] = {
  monday:    { enabled: true,  start: "09:00", end: "18:00" },
  tuesday:   { enabled: true,  start: "09:00", end: "18:00" },
  wednesday: { enabled: true,  start: "09:00", end: "18:00" },
  thursday:  { enabled: true,  start: "09:00", end: "18:00" },
  friday:    { enabled: true,  start: "09:00", end: "18:00" },
  saturday:  { enabled: true,  start: "09:00", end: "16:00" },
  sunday:    { enabled: false, start: "09:00", end: "18:00" },
};

export const useSalonStore = create<SalonStore>()((set, get) => ({
  tenantId: null,
  planExpiresAt: null,
  settings: null,
  services: [],
  appointments: [],
  portfolio: [],
  tenantPayments: [],
  toasts: [],
  
  addToast: (message, type = "success") => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },
  
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  },

  setStoreData: (data) => set({ ...data }),

  updateSettings: async (newSettings) => {
    const { tenantId, settings } = get();
    if (!tenantId || !settings) return;
    
    const merged = { ...settings, ...newSettings };
    set({ settings: merged });
    
    // Write to Supabase
    await supabase.from("salon_settings").update({
      salon_name: merged.salonName,
      logo_url: merged.logoUrl,
      banner_url: merged.bannerUrl,
      header_display: merged.headerDisplay,
      moncash_number: merged.monCashNumber,
      natcash_number: merged.natCashNumber,
      zelle_info: merged.zelleInfo,
      cashapp_info: merged.cashAppInfo,
      paypal_info: merged.paypalInfo,
      working_hours: merged.workingHours,
      buffer_minutes: merged.bufferMinutes,
      show_availability: merged.showAvailability,
      theme: merged.theme,
      custom_theme_color: merged.customThemeColor,
      instagram_url: merged.instagramUrl,
      facebook_url: merged.facebookUrl,
      tiktok_url: merged.tiktokUrl,
      whatsapp_number: merged.whatsappNumber,
      address: merged.address,
      whatsapp_visibility: merged.whatsappVisibility,
    }).eq("tenant_id", tenantId);
  },

  addService: async (service) => {
    const { tenantId } = get();
    if (!tenantId) return;

    // Optimistic UI update (using local ID initially)
    set((state) => ({ services: [...state.services, service] }));

    const { data, error } = await supabase.from("services").insert({
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
    }).select().single();

    if (!error && data) {
      // Replace the optimistic service with the real one from DB (real UUID)
      set((state) => ({
        services: state.services.map((s) => s.id === service.id ? { ...s, id: data.id } : s)
      }));
    }
  },

  updateService: async (id, updated) => {
    set((state) => ({
      services: state.services.map((s) => (s.id === id ? { ...s, ...updated } : s)),
    }));

    // Convert keys to snake_case for DB
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
      await supabase.from("services").update(dbUpdate).eq("id", id);
    }
  },

  deleteService: async (id) => {
    const serviceToDelete = get().services.find((s) => s.id === id);
    if (serviceToDelete?.imageUrl) {
      deleteImageFromUrl(serviceToDelete.imageUrl);
    }
    
    set((state) => ({ services: state.services.filter((s) => s.id !== id) }));
    await supabase.from("services").delete().eq("id", id);
  },

  addAppointment: async (appointment) => {
    const { tenantId } = get();
    if (!tenantId) return;

    set((state) => ({ appointments: [appointment, ...state.appointments] }));

    const { data, error } = await supabase.from("appointments").insert({
      tenant_id: tenantId,
      service_id: appointment.serviceId,
      date: appointment.date,
      time: appointment.time,
      client_name: appointment.clientName,
      client_phone: appointment.clientPhone,
      client_email: appointment.clientEmail,
      deposit_receipt_url: appointment.screenshotName,
      status: appointment.status,
    }).select().single();

    if (!error && data) {
      set((state) => ({
        appointments: state.appointments.map((a) => a.id === appointment.id ? { ...a, id: data.id } : a)
      }));
    }
  },

  updateAppointmentStatus: async (id, status) => {
    set((state) => ({
      appointments: state.appointments.map((a) => a.id === id ? { ...a, status } : a),
    }));
    await supabase.from("appointments").update({ status }).eq("id", id);
  },

  addPortfolioPhoto: async (photo) => {
    const { tenantId } = get();
    if (!tenantId) return;

    set((state) => ({ portfolio: [photo, ...state.portfolio] }));

    const { data, error } = await supabase.from("portfolio").insert({
      tenant_id: tenantId,
      image_url: photo.imageUrl,
      category: photo.category,
      caption: photo.caption,
      ig_link: photo.instagramUrl
    }).select().single();

    if (!error && data) {
      set((state) => ({
        portfolio: state.portfolio.map((p) => p.id === photo.id ? { ...p, id: data.id } : p)
      }));
    }
  },

  deletePortfolioPhoto: async (id) => {
    const photoToDelete = get().portfolio.find((p) => p.id === id);
    if (photoToDelete?.imageUrl) {
      deleteImageFromUrl(photoToDelete.imageUrl);
    }

    set((state) => ({ portfolio: state.portfolio.filter((p) => p.id !== id) }));
    await supabase.from("portfolio").delete().eq("id", id);
  },

  updatePortfolioPhoto: async (id, updates) => {
    set((state) => ({
      portfolio: state.portfolio.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));

    const dbUpdate: any = {};
    if (updates.imageUrl !== undefined) dbUpdate.image_url = updates.imageUrl;
    if (updates.category !== undefined) dbUpdate.category = updates.category;
    if (updates.caption !== undefined) dbUpdate.caption = updates.caption;
    if (updates.instagramUrl !== undefined) dbUpdate.ig_link = updates.instagramUrl;

    if (Object.keys(dbUpdate).length > 0) {
      await supabase.from("portfolio").update(dbUpdate).eq("id", id);
    }
  },

  fetchTenantPayments: async () => {
    const { tenantId } = get();
    if (!tenantId) return;
    const { data, error } = await supabase
      .from("tenant_payments")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });
    if (!error && data) {
      set({ tenantPayments: data as TenantPayment[] });
    }
  },

  submitTenantPayment: async (amount, currency, receiptUrl) => {
    const { tenantId } = get();
    if (!tenantId) return;
    const { data, error } = await supabase
      .from("tenant_payments")
      .insert({
        tenant_id: tenantId,
        amount,
        currency,
        receipt_url: receiptUrl,
        status: "pending"
      })
      .select()
      .single();
    if (!error && data) {
      set((state) => ({ tenantPayments: [data as TenantPayment, ...state.tenantPayments] }));
    } else {
      console.error("Failed to submit payment", error);
    }
  }
}));

export function computeMinDeposit(service: Service, currency: "USD" | "HTG"): number {
  if (service.depositType === "percentage") {
    const base = currency === "USD" ? service.priceUSD : service.priceHTG;
    return Math.ceil((base * service.depositPercentage) / 100);
  } else {
    return currency === "USD" ? service.depositFixedUSD : service.depositFixedHTG;
  }
}
