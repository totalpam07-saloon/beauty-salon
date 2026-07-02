import { Appointment, SalonSettings, Service } from "@/store/salon";

/** Parse duration string like "2h", "1h30", "45min" → total minutes */
export function parseDurationMinutes(duration: string): number {
  const hourMatch = duration.match(/(\d+)h/);
  const minMatch = duration.match(/(\d+)(?:min|m)(?!.*h)/);
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const mins = minMatch ? parseInt(minMatch[1]) : 0;
  return hours * 60 + mins;
}

/** Convert "HH:MM" to total minutes since midnight */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Convert total minutes since midnight to "HH:MM" */
export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60).toString().padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** Map JS Date.getDay() (0=Sun) to our store key */
const dayIndexToKey = [
  "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
] as const;

export function getDayKey(date: Date): typeof dayIndexToKey[number] {
  return dayIndexToKey[date.getDay()];
}

/**
 * Generate all possible start slots for a given date, based on:
 * - Working hours for that weekday
 * - Service duration + buffer
 */
export function getSlots(
  dateStr: string,
  serviceDurationMins: number,
  settings: SalonSettings
): string[] {
  const date = new Date(dateStr + "T12:00:00"); // noon avoids DST issues
  const dayKey = getDayKey(date);
  const day = settings.workingHours[dayKey];

  if (!day?.enabled) return [];

  const startMins = timeToMinutes(day.start);
  const endMins = timeToMinutes(day.end);
  const slotSize = serviceDurationMins + settings.bufferMinutes;

  const slots: string[] = [];
  let current = startMins;

  while (current + serviceDurationMins <= endMins) {
    slots.push(minutesToTime(current));
    current += slotSize;
  }

  return slots;
}

/**
 * Returns a Set of blocked start times (as "HH:MM") for a given date.
 * A slot is blocked if any non-rejected appointment on that date overlaps it.
 */
export function getBlockedSlots(
  dateStr: string,
  appointments: Appointment[],
  services: Service[],
  bufferMinutes: number
): Set<string> {
  const blocked = new Set<string>();

  const dayAppts = appointments.filter(
    (a) => a.date === dateStr && a.status !== "rejected"
  );

  for (const appt of dayAppts) {
    const svc = services.find((s) => s.id === appt.serviceId);
    const durMins = svc ? parseDurationMinutes(svc.duration) : 60;
    const startMins = timeToMinutes(appt.time);
    const endMins = startMins + durMins + bufferMinutes;

    // Block the exact start time
    blocked.add(appt.time);

    // Also block any slots that would overlap with this appointment's window
    // (e.g. if appt is 10:00–12:30 with buffer, a 9:30 slot with 2h service would overlap)
    // We'll mark the "occupied window" and check it during slot filtering
    blocked.add(`__range__${appt.time}__${endMins}`);
  }

  return blocked;
}

/**
 * Check if a candidate slot (startTime) is available given blocked slots.
 * Takes into account overlapping windows, not just exact start times.
 */
export function isSlotAvailable(
  slotTime: string,
  serviceDurationMins: number,
  blockedSlots: Set<string>,
  bufferMinutes: number
): boolean {
  const slotStart = timeToMinutes(slotTime);
  const slotEnd = slotStart + serviceDurationMins + bufferMinutes;

  // Check direct start-time collision
  if (blockedSlots.has(slotTime)) return false;

  // Check overlap with any existing appointment window
  for (const entry of blockedSlots) {
    if (!entry.startsWith("__range__")) continue;
    const [, , apptTime, apptEndStr] = entry.split("__");
    const apptStart = timeToMinutes(apptTime);
    const apptEnd = parseInt(apptEndStr);

    // Overlap check: our slot overlaps with existing appointment if:
    // slotStart < apptEnd AND slotEnd > apptStart
    if (slotStart < apptEnd && slotEnd > apptStart) {
      return false;
    }
  }

  return true;
}

/** Get Monday of the week containing the given date */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Format date as YYYY-MM-DD */
export function formatDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

/** Format date as display string, e.g. "Lun 1" */
export function formatDayLabel(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, { weekday: "short", day: "numeric" });
}
