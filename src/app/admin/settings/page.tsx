"use client";

import { useState, useEffect } from "react";
import { useSalonStore } from "@/store/salon";
import { useI18n } from "@/components/i18n-provider";
import { Check } from "lucide-react";

export default function SettingsPage() {
  const { t } = useI18n();
  const { settings, updateSettings } = useSalonStore();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass = "w-full bg-background border-2 border-border rounded-2xl px-4 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground";

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">{t("admin.navSettings")}</h1>
        <p className="text-foreground/50 mt-1">{t("admin.setSub")}</p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        {/* Salon Name */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground/70 ml-1 block">{t("admin.salonName")}</label>
          <input className={inputClass} value={form.salonName} onChange={(e) => setForm({ ...form, salonName: e.target.value })} />
        </div>

        {/* HTG Payment Methods */}
        <div className="space-y-4">
          <p className="text-sm font-extrabold text-foreground/80 border-b border-border pb-2">💰 {t("admin.payHTG")}</p>
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/50 ml-1 block">MonCash ({t("admin.phoneLabel")})</label>
            <input className={inputClass} placeholder="+509 XXXX-XXXX" value={form.monCashNumber} onChange={(e) => setForm({ ...form, monCashNumber: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/50 ml-1 block">NatCash ({t("admin.phoneLabel")})</label>
            <input className={inputClass} placeholder={`+509 XXXX-XXXX (${t("admin.optional")})`} value={form.natCashNumber} onChange={(e) => setForm({ ...form, natCashNumber: e.target.value })} />
          </div>
        </div>

        {/* USD Payment Methods */}
        <div className="space-y-4">
          <p className="text-sm font-extrabold text-foreground/80 border-b border-border pb-2">💵 {t("admin.payUSD")}</p>
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/50 ml-1 block">Zelle ({t("admin.emailOrPhone")})</label>
            <input className={inputClass} placeholder={t("admin.emailOrPhone")} value={form.zelleInfo} onChange={(e) => setForm({ ...form, zelleInfo: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/50 ml-1 block">CashApp ($cashtag)</label>
            <input className={inputClass} placeholder={`$cashtag (${t("admin.optional")})`} value={form.cashAppInfo} onChange={(e) => setForm({ ...form, cashAppInfo: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/50 ml-1 block">PayPal (email)</label>
            <input className={inputClass} placeholder={`Email PayPal (${t("admin.optional")})`} value={form.paypalInfo} onChange={(e) => setForm({ ...form, paypalInfo: e.target.value })} />
          </div>
        </div>

        <button onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 p-5 rounded-2xl font-extrabold text-lg transition-all duration-300 shadow-md ${saved ? "bg-green-500 text-white" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
          {saved ? <><Check size={20} /> {t("admin.saved")}</> : t("admin.saveBtn")}
        </button>
      </div>
    </div>
  );
}
