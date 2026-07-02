"use client";

import { useEffect, useRef } from "react";
import { useSalonStore, SalonSettings, defaultWorkingHours } from "@/store/salon";

interface TenantProviderProps {
  tenantId: string;
  planExpiresAt: string | null;
  settings: SalonSettings | null;
  children: React.ReactNode;
}

export function TenantProvider({ tenantId, planExpiresAt, settings, children }: TenantProviderProps) {
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
    });
    initialized.current = true;
  }

  // Also update if props change (e.g. navigation between domains, rare but possible)
  useEffect(() => {
    useSalonStore.getState().setStoreData({
      tenantId,
      planExpiresAt,
      settings: safeSettings,
    });
  }, [tenantId, planExpiresAt, safeSettings]);

  return <>{children}</>;
}
