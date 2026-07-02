"use client";

import { useI18n } from "@/components/i18n-provider";
import { SalonSettings } from "@/store/salon";

export function TabPayments({
  form,
  setForm,
}: {
  form: SalonSettings;
  setForm: (v: any) => void;
}) {
  const { t } = useI18n();
  const inputClass = "w-full bg-background border-2 border-border rounded-2xl px-4 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground";

  return (
    <div className="space-y-8">
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
    </div>
  );
}
