import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { deleteImageFromUrl } from "@/lib/supabase/storage";

const supabase = createClient();

export type DepositType = "percentage" | "fixed";

export interface Staff {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
}

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
  staffId?: string; // New: Who is performing the service
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

export interface Review {
  id: string;
  tenantId: string;
  appointmentId: string;
  rating: number;
  comment?: string;
  imageUrl?: string;
  videoUrl?: string;
  isAnonymous: boolean;
  createdAt: string;
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
  templateId?: string;
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
  
  // Initialization
  setStoreData: (data: { tenantId: string; planExpiresAt: string | null; settings: SalonSettings | null }) => void;
  
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
}));

export function computeMinDeposit(service: Service, currency: "USD" | "HTG"): number {
  if (service.depositType === "percentage") {
    const base = currency === "USD" ? service.priceUSD : service.priceHTG;
    return Math.ceil((base * service.depositPercentage) / 100);
  } else {
    return currency === "USD" ? service.depositFixedUSD : service.depositFixedHTG;
  }
}
