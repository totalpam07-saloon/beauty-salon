"use client";

import { useI18n } from "@/components/i18n-provider";
import { SalonSettings } from "@/store/salon";

const DAY_KEYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"] as const;
type DayKey = typeof DAY_KEYS[number];

const DAY_LABELS: Record<DayKey, { fr: string; ht: string }> = {
  monday:    { fr: "Lundi",    ht: "Lendi" },
  tuesday:   { fr: "Mardi",   ht: "Madi" },
  wednesday: { fr: "Mercredi",ht: "Mèkredi" },
  thursday:  { fr: "Jeudi",   ht: "Jedi" },
  friday:    { fr: "Vendredi",ht: "Vandredi" },
  saturday:  { fr: "Samedi",  ht: "Samdi" },
  sunday:    { fr: "Dimanche",ht: "Dimanch" },
};

export function TabHours({
  form,
  setForm,
}: {
  form: SalonSettings;
  setForm: (v: any) => void;
}) {
  const { t, language } = useI18n();
  const timeInputClass = "bg-background border-2 border-border rounded-xl px-3 py-2 outline-none focus:border-primary transition-all font-medium text-foreground text-sm";

  const updateDay = (day: DayKey, field: "enabled" | "start" | "end", value: string | boolean) => {
    setForm((prev: any) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: { ...prev.workingHours[day], [field]: value },
      },
    }));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-extrabold text-foreground/80 border-b border-border pb-2">🗓️ {t("admin.workingHours")}</p>

      <div className="space-y-3">
        {DAY_KEYS.map((day) => {
          const dayData = form.workingHours?.[day] ?? { enabled: false, start: "09:00", end: "18:00" };
          const label = DAY_LABELS[day][language as "fr" | "ht"] ?? DAY_LABELS[day].fr;
          return (
            <div key={day} className={`rounded-2xl border-2 transition-all ${dayData.enabled ? "border-primary/30 bg-primary/5" : "border-border bg-background"} p-3`}>
              <div className="flex items-center justify-between gap-4">
                {/* Toggle + Day name */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => updateDay(day, "enabled", !dayData.enabled)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${dayData.enabled ? "bg-primary" : "bg-border"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${dayData.enabled ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                  <span className={`text-sm font-bold ${dayData.enabled ? "text-foreground" : "text-foreground/40"}`}>{label}</span>
                </label>

                {/* Time pickers */}
                {dayData.enabled && (
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="time"
                      value={dayData.start}
                      onChange={(e) => updateDay(day, "start", e.target.value)}
                      className={timeInputClass}
                    />
                    <span className="text-foreground/40 font-bold">→</span>
                    <input
                      type="time"
                      value={dayData.end}
                      onChange={(e) => updateDay(day, "end", e.target.value)}
                      className={timeInputClass}
                    />
                  </div>
                )}
                {!dayData.enabled && (
                  <span className="text-xs font-bold text-foreground/30">{t("admin.closed")}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Buffer */}
      <div className="flex items-center justify-between bg-secondary/30 rounded-2xl p-4 border border-border mt-6">
        <div>
          <p className="text-sm font-bold text-foreground">{t("admin.bufferTime")}</p>
          <p className="text-xs text-foreground/50">{t("admin.bufferDesc")}</p>
        </div>
        <select
          value={form.bufferMinutes}
          onChange={(e) => setForm({ ...form, bufferMinutes: Number(e.target.value) })}
          className="bg-background border-2 border-border rounded-xl px-3 py-2 font-bold text-sm outline-none focus:border-primary"
        >
          {[0, 15, 30, 45, 60].map((v) => (
            <option key={v} value={v}>{v === 0 ? "Aucun" : `${v} min`}</option>
          ))}
        </select>
      </div>

      {/* Privacy toggle */}
      <div className="flex items-center justify-between bg-secondary/30 rounded-2xl p-4 border border-border">
        <div>
          <p className="text-sm font-bold text-foreground">{t("admin.showAvail")}</p>
          <p className="text-xs text-foreground/50">{t("admin.showAvailDesc")}</p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ ...form, showAvailability: !form.showAvailability })}
          className={`relative w-11 h-6 rounded-full transition-all duration-300 ${form.showAvailability ? "bg-primary" : "bg-border"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${form.showAvailability ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
    </div>
  );
}
