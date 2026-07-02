"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Appointment, SalonSettings, Service } from "@/store/salon";
import {
  getWeekStart,
  formatDateStr,
  formatDayLabel,
  getSlots,
  getBlockedSlots,
  isSlotAvailable,
  parseDurationMinutes,
  getDayKey,
} from "@/lib/availability";

interface WeekCalendarProps {
  serviceDuration: string;      // e.g. "2h"
  settings: SalonSettings;
  appointments: Partial<Appointment>[];
  services: Service[];
  selectedDate: string;
  selectedTime: string;
  onSelect: (date: string, time: string) => void;
  language: string;
}

export function WeekCalendar({
  serviceDuration,
  settings,
  appointments,
  services,
  selectedDate,
  selectedTime,
  onSelect,
  language,
}: WeekCalendarProps) {
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const today = new Date();
    return getWeekStart(today);
  });

  const durMins = parseDurationMinutes(serviceDuration);
  const locale = language === "ht" ? "fr-HT" : "fr-FR";

  // Build 7-day array from weekStart (Mon→Sun)
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  // Collect ALL unique slots across the week so rows are consistent
  const allSlots = useMemo(() => {
    const slotSet = new Set<string>();
    days.forEach((d) => {
      const dateStr = formatDateStr(d);
      getSlots(dateStr, durMins, settings).forEach((s) => slotSet.add(s));
    });
    return Array.from(slotSet).sort();
  }, [days, durMins, settings]);

  const today = formatDateStr(new Date());

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    // Don't go before today's week
    if (d >= getWeekStart(new Date())) setWeekStart(d);
    else setWeekStart(getWeekStart(new Date()));
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const monthLabel = weekStart.toLocaleDateString(locale, { month: "long", year: "numeric" });

  return (
    <div className="space-y-3">
      {/* Header nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevWeek}
          className="p-2 rounded-xl border border-border hover:bg-secondary transition-colors"
        >
          <ChevronLeft size={18} className="text-foreground/60" />
        </button>
        <span className="text-sm font-bold capitalize text-foreground/70">{monthLabel}</span>
        <button
          onClick={nextWeek}
          className="p-2 rounded-xl border border-border hover:bg-secondary transition-colors"
        >
          <ChevronRight size={18} className="text-foreground/60" />
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto -mx-1">
        <div className="min-w-[340px]">
          {/* Day headers */}
          <div className="grid grid-cols-8 gap-1 mb-1">
            <div /> {/* empty corner */}
            {days.map((d) => {
              const dateStr = formatDateStr(d);
              const isToday = dateStr === today;
              const dayKey = getDayKey(d);
              const dayEnabled = settings.workingHours[dayKey]?.enabled;
              return (
                <div
                  key={dateStr}
                  className={`text-center text-[11px] font-bold py-1.5 rounded-lg
                    ${isToday ? "bg-primary/15 text-primary" : dayEnabled ? "text-foreground/60" : "text-foreground/25"}`}
                >
                  {formatDayLabel(d, locale)}
                </div>
              );
            })}
          </div>

          {/* Slot rows */}
          {allSlots.length === 0 ? (
            <div className="text-center py-8 text-foreground/40 text-sm font-medium">
              Aucun créneau disponible cette semaine
            </div>
          ) : (
            allSlots.map((slot) => (
              <div key={slot} className="grid grid-cols-8 gap-1 mb-1">
                {/* Time label */}
                <div className="flex items-center justify-end pr-1">
                  <span className="text-[10px] font-bold text-foreground/40">{slot}</span>
                </div>

                {/* Day cells */}
                {days.map((d) => {
                  const dateStr = formatDateStr(d);
                  const isPast = dateStr < today;
                  const dayKey = getDayKey(d);
                  const dayEnabled = settings.workingHours[dayKey]?.enabled;
                  const daySlots = getSlots(dateStr, durMins, settings);
                  const hasThisSlot = daySlots.includes(slot);

                  if (!hasThisSlot || !dayEnabled || isPast) {
                    return (
                      <div
                        key={dateStr}
                        className="h-9 rounded-lg bg-secondary/20 flex items-center justify-center"
                      >
                        {!dayEnabled && (
                          <span className="text-[9px] text-foreground/20">—</span>
                        )}
                      </div>
                    );
                  }

                  const blocked = getBlockedSlots(dateStr, appointments, services, settings.bufferMinutes);
                  const available = isSlotAvailable(slot, durMins, blocked, settings.bufferMinutes);
                  const isSelected = selectedDate === dateStr && selectedTime === slot;

                  if (!available) {
                    return (
                      <div
                        key={dateStr}
                        className="h-9 rounded-lg bg-red-100/60 dark:bg-red-900/20 flex items-center justify-center border border-red-200/40"
                        title={settings.showAvailability ? "Déjà réservé" : "Indisponible"}
                      >
                        <span className="text-[9px] font-bold text-red-400">
                          {settings.showAvailability ? "Pris" : "✕"}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={dateStr}
                      onClick={() => onSelect(dateStr, slot)}
                      className={`h-9 rounded-lg border-2 text-[10px] font-bold transition-all duration-200
                        ${isSelected
                          ? "bg-primary text-primary-foreground border-primary scale-105 shadow-md"
                          : "bg-background border-border hover:border-primary/60 hover:bg-primary/5 text-foreground/70"
                        }`}
                    >
                      {isSelected ? "✓" : ""}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Selected slot summary */}
      {selectedDate && selectedTime && (
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-2xl px-4 py-3 text-sm font-bold text-primary animate-in fade-in duration-300">
          <span>✅</span>
          <span>
            {new Date(selectedDate + "T12:00:00").toLocaleDateString(locale, {
              weekday: "long", day: "numeric", month: "long",
            })} à {selectedTime}
          </span>
        </div>
      )}
    </div>
  );
}
