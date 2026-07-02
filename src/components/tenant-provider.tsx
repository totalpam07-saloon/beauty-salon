"use client";

import { useEffect, useRef } from "react";
import { useSalonStore, SalonSettings, Service, Appointment, PortfolioPhoto, defaultWorkingHours } from "@/store/salon";

interface TenantProviderProps {
  tenantId: string;
  planExpiresAt: string | null;
  settings: SalonSettings | null;
  services: Service[];
  appointments: Appointment[];
  portfolio: PortfolioPhoto[];
  children: React.ReactNode;
}

export function TenantProvider({ tenantId, planExpiresAt, settings, services, appointments, portfolio, children }: TenantProviderProps) {
  const initialized = useRef(false);

  // Default settings if null
  const safeSettings = settings || {
    salonName: "Mon Salon",
    monCashNumber: "",
    natCashNumber: "",
    zelleInfo: "",
    cashAppInfo: "",
    paypalInfo: "",
    logoUrl: "",
    bannerUrl: "",
    bufferMinutes: 30,
    showAvailability: true,
    workingHours: defaultWorkingHours,
  };

  if (!initialized.current) {
    useSalonStore.getState().setStoreData({
      tenantId,
      planExpiresAt,
      settings: safeSettings,
      services,
      appointments,
      portfolio,
    });
    initialized.current = true;
  }

  // Also update if props change (e.g. navigation between domains, rare but possible)
  useEffect(() => {
    useSalonStore.getState().setStoreData({
      tenantId,
      settings: safeSettings,
      services,
      appointments,
      portfolio,
    });
  }, [tenantId, safeSettings, services, appointments, portfolio]);

  return <>{children}</>;
}
