"use client";

import { Service, SalonSettings, Appointment, Staff } from "@/store/salon";
import { useBookingFlow } from "./useBookingFlow";
import { BookingClassic } from "./BookingClassic";
import { BookingLuxe } from "./BookingLuxe";
import { BookingSpa } from "./BookingSpa";
import { BookingPop } from "./BookingPop";
import { BookingEditorial } from "./BookingEditorial";
import { BookingPlayful } from "./BookingPlayful";
import { BookingRetro } from "./BookingRetro";

interface ClientBookingFlowProps {
  tenantId: string;
  domain: string;
  services: Service[];
  settings: SalonSettings;
  appointments: Partial<Appointment>[];
  staffList?: Staff[];
}

export default function ClientBookingFlow({
  tenantId,
  domain,
  services,
  settings,
  appointments,
  staffList = []
}: ClientBookingFlowProps) {
  const flow = useBookingFlow({
    tenantId,
    domain,
    services,
    settings,
    appointments,
    staffList
  });

  const props = {
    tenantId,
    domain,
    services,
    settings,
    appointments,
    staffList,
    flow
  };

  switch (settings?.theme) {
    case "classic":
      return <BookingClassic {...props} />;
    case "luxe":
      return <BookingLuxe {...props} />;
    case "spa":
      return <BookingSpa {...props} />;
    case "pop":
      return <BookingPop {...props} />;
    case "editorial":
      return <BookingEditorial {...props} />;
    case "playful":
      return <BookingPlayful {...props} />;
    case "retro":
      return <BookingRetro {...props} />;
    default:
      return <BookingClassic {...props} />;
  }
}
