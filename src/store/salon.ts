import { create } from "zustand";
import { persist } from "zustand/middleware";

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
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: "pending" | "approved" | "rejected";
  screenshotName: string;
  paymentMethod: string;
  amountPaid: string;
  createdAt: string;
}

export interface SalonSettings {
  salonName: string;
  monCashNumber: string;
  natCashNumber: string;
  zelleInfo: string;
  cashAppInfo: string;
  paypalInfo: string;
}

interface SalonStore {
  settings: SalonSettings;
  services: Service[];
  appointments: Appointment[];
  updateSettings: (settings: Partial<SalonSettings>) => void;
  addService: (service: Service) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
}

export const useSalonStore = create<SalonStore>()(
  persist(
    (set) => ({
      settings: {
        salonName: "Salon de Beauté",
        monCashNumber: "+509 3700-0000",
        natCashNumber: "",
        zelleInfo: "salon@zelle.com",
        cashAppInfo: "",
        paypalInfo: "",
      },
      services: [
        { id: "1", name: "Knotless Braids", priceUSD: 150, priceHTG: 19500, depositType: "percentage", depositPercentage: 20, depositFixedUSD: 0, depositFixedHTG: 0, duration: "4h" },
        { id: "2", name: "Silk Press", priceUSD: 85, priceHTG: 11000, depositType: "percentage", depositPercentage: 20, depositFixedUSD: 0, depositFixedHTG: 0, duration: "2h" },
        { id: "3", name: "Full Face Makeup", priceUSD: 65, priceHTG: 8450, depositType: "fixed", depositPercentage: 0, depositFixedUSD: 20, depositFixedHTG: 2600, duration: "1h" },
      ],
      appointments: [],
      updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      addService: (service) =>
        set((state) => ({ services: [...state.services, service] })),
      updateService: (id, updated) =>
        set((state) => ({
          services: state.services.map((s) => (s.id === id ? { ...s, ...updated } : s)),
        })),
      deleteService: (id) =>
        set((state) => ({ services: state.services.filter((s) => s.id !== id) })),
      addAppointment: (appointment) =>
        set((state) => ({ appointments: [appointment, ...state.appointments] })),
      updateAppointmentStatus: (id, status) =>
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),
    }),
    { name: "salon-store-v3" }
  )
);

// Helper: compute the minimum deposit for a service in a given currency
export function computeMinDeposit(service: Service, currency: "USD" | "HTG"): number {
  if (service.depositType === "percentage") {
    const base = currency === "USD" ? service.priceUSD : service.priceHTG;
    return Math.ceil(base * service.depositPercentage / 100);
  } else {
    return currency === "USD" ? service.depositFixedUSD : service.depositFixedHTG;
  }
}
