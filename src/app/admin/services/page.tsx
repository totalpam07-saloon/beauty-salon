"use client";

import { useState } from "react";
import { useSalonStore, Service, DepositType } from "@/store/salon";
import { useI18n } from "@/components/i18n-provider";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

type ServiceForm = Omit<Service, "id">;

const emptyForm: ServiceForm = {
  name: "",
  priceUSD: 0,
  priceHTG: 0,
  depositType: "percentage",
  depositPercentage: 20,
  depositFixedUSD: 0,
  depositFixedHTG: 0,
  duration: "",
};

export default function ServicesPage() {
  const { t } = useI18n();
  const { services, addService, updateService, deleteService } = useSalonStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

  const handleSave = () => {
    if (editing) {
      updateService(editing, form);
      setEditing(null);
    } else {
      addService({ ...form, id: crypto.randomUUID() });
      setAdding(false);
    }
    setForm(emptyForm);
  };

  const startEdit = (s: Service) => {
    setEditing(s.id);
    setAdding(false);
    setForm({ name: s.name, priceUSD: s.priceUSD, priceHTG: s.priceHTG, depositType: s.depositType, depositPercentage: s.depositPercentage, depositFixedUSD: s.depositFixedUSD, depositFixedHTG: s.depositFixedHTG, duration: s.duration });
  };

  const cancel = () => { setEditing(null); setAdding(false); setForm(emptyForm); };

  const inputClass = "w-full bg-background border-2 border-border rounded-2xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground";

  const ServiceForm = () => (
    <div className="space-y-4">
      <input className={inputClass} placeholder={t("admin.svcName")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-foreground/60 ml-1 block mb-1">{t("admin.priceUSD")}</label>
          <input className={inputClass} type="number" placeholder="ex: 150" value={form.priceUSD || ""} onChange={(e) => setForm({ ...form, priceUSD: Number(e.target.value) })} />
        </div>
        <div>
          <label className="text-xs font-bold text-foreground/60 ml-1 block mb-1">{t("admin.priceHTG")}</label>
          <input className={inputClass} type="number" placeholder="ex: 19500" value={form.priceHTG || ""} onChange={(e) => setForm({ ...form, priceHTG: Number(e.target.value) })} />
        </div>
      </div>

      <input className={inputClass} placeholder={t("admin.duration")} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />

      {/* Deposit Policy */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-foreground/60 ml-1 block">{t("admin.depType")}</label>
        <div className="grid grid-cols-2 gap-2">
          {(["percentage", "fixed"] as DepositType[]).map((dt) => (
            <button key={dt} onClick={() => setForm({ ...form, depositType: dt })}
              className={`py-3 rounded-2xl border-2 font-bold text-sm transition-all ${form.depositType === dt ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-background border-border text-foreground/70 hover:border-primary/40"}`}>
              {dt === "percentage" ? t("admin.depPercent") : t("admin.depFixed")}
            </button>
          ))}
        </div>

        {form.depositType === "percentage" ? (
          <div>
            <label className="text-xs font-bold text-foreground/60 ml-1 block mb-1">{t("admin.percentLabel")}</label>
            <input className={inputClass} type="number" placeholder="ex: 20" value={form.depositPercentage || ""} onChange={(e) => setForm({ ...form, depositPercentage: Number(e.target.value) })} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground/60 ml-1 block mb-1">{t("admin.fixedUSD")}</label>
              <input className={inputClass} type="number" placeholder="ex: 30" value={form.depositFixedUSD || ""} onChange={(e) => setForm({ ...form, depositFixedUSD: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-xs font-bold text-foreground/60 ml-1 block mb-1">{t("admin.fixedHTG")}</label>
              <input className={inputClass} type="number" placeholder="ex: 3900" value={form.depositFixedHTG || ""} onChange={(e) => setForm({ ...form, depositFixedHTG: Number(e.target.value) })} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={handleSave} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity">
          <Check size={16} /> {t("admin.save")}
        </button>
        <button onClick={cancel} className="flex items-center gap-2 border-2 border-border px-5 py-3 rounded-2xl font-bold hover:bg-secondary transition-colors text-foreground">
          <X size={16} /> {t("admin.cancel")}
        </button>
      </div>
    </div>
  );

  const depositLabel = (s: Service) => {
    if (s.depositType === "percentage") return `${s.depositPercentage}% ${t("admin.depOf")}`;
    return `$${s.depositFixedUSD} / ${s.depositFixedHTG.toLocaleString()} HTG ${t("admin.depFixedLabel")}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">{t("admin.svcTitle")}</h1>
          <p className="text-foreground/50 mt-1">{t("admin.svcSub")}</p>
        </div>
        {!adding && !editing && (
          <button onClick={() => { setAdding(true); setForm(emptyForm); }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-2xl font-bold shadow hover:opacity-90 transition-opacity">
            <Plus size={18} /> {t("admin.add")}
          </button>
        )}
      </div>

      {adding && (
        <div className="bg-card border-2 border-primary rounded-3xl p-6 shadow-lg">
          <h2 className="text-lg font-extrabold text-foreground mb-4">{t("admin.newSvc")}</h2>
          <ServiceForm />
        </div>
      )}

      <div className="space-y-4">
        {services.map((s) => (
          <div key={s.id} className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
            {editing === s.id ? (
              <div>
                <h3 className="font-extrabold mb-4 text-foreground">{t("admin.editSvc")}: {s.name}</h3>
                <ServiceForm />
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-extrabold text-foreground">{s.name}</p>
                  <p className="text-sm font-medium text-foreground/60">{s.duration} · {depositLabel(s)}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xl font-black text-primary">${s.priceUSD}</p>
                    <p className="text-sm font-bold text-foreground/50">{s.priceHTG.toLocaleString()} HTG</p>
                  </div>
                  <button onClick={() => startEdit(s)} className="p-2 rounded-xl hover:bg-secondary transition-colors text-foreground/60">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => deleteService(s.id)} className="p-2 rounded-xl hover:bg-red-100 transition-colors text-foreground/40 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
