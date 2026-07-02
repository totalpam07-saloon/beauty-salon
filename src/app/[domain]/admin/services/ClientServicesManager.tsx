"use client";

import { useState, useTransition } from "react";
import { useSalonStore, Service, DepositType } from "@/store/salon";
import { addServiceAction, updateServiceAction, deleteServiceAction } from "@/app/actions";
import { useI18n } from "@/components/i18n-provider";
import { ImageInput } from "@/components/image-input";
import { Plus, Pencil, Trash2, Check, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { ConfirmModal } from "@/components/ConfirmModal";

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
  imageUrl: "",
  category: "",
  description: "",
};

interface ClientServicesManagerProps {
  tenantId: string;
  domain: string;
  services: Service[];
}

export default function ClientServicesManager({ tenantId, domain, services }: ClientServicesManagerProps) {
  const { t } = useI18n();
  const { addToast } = useSalonStore();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleSave = () => {
    startTransition(async () => {
      try {
        if (editing) {
          await updateServiceAction(tenantId, domain, editing, form);
          addToast("Service modifié avec succès", "success");
          setEditing(null);
        } else {
          await addServiceAction(tenantId, domain, { ...form, id: crypto.randomUUID() });
          addToast("Nouveau service ajouté", "success");
          setAdding(false);
        }
        setForm(emptyForm);
      } catch (e) {
        addToast("Erreur", "error");
      }
    });
  };

  const startEdit = (s: Service) => {
    setEditing(s.id);
    setAdding(false);
    setForm({
      name: s.name, priceUSD: s.priceUSD, priceHTG: s.priceHTG,
      depositType: s.depositType, depositPercentage: s.depositPercentage,
      depositFixedUSD: s.depositFixedUSD, depositFixedHTG: s.depositFixedHTG,
      duration: s.duration, imageUrl: s.imageUrl || "", category: s.category || "", description: s.description || "",
    });
  };

  const cancel = () => { setEditing(null); setAdding(false); setForm(emptyForm); };

  const inputClass = "w-full bg-background border-2 border-border rounded-2xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground";

  const categorySuggestions = Array.from(new Set(services.map(s => s.category).filter(Boolean))) as string[];

  const serviceFormFields = (
    <div className="space-y-4">
      <input className={inputClass} placeholder={t("admin.svcName")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground/60 ml-1 block">Catégorie</label>
        <input className={inputClass} placeholder="ex: Coupe, Coloration, Ongles..." value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        {categorySuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {categorySuggestions.map((c) => (
              <button key={c} type="button" onClick={() => setForm({ ...form, category: c })}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${form.category === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground/60 hover:border-primary/50"}`}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-foreground/60 ml-1 block">Description du Service</label>
        <textarea className={`${inputClass} min-h-[100px] resize-y`} placeholder="Décrivez en détail ce que comprend ce service..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>

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
            <button key={dt} type="button" onClick={() => setForm({ ...form, depositType: dt })}
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

      {/* Service Image */}
      <div className="border-t border-border pt-4">
        <ImageInput
          label="Photo du service"
          hint="Coller un lien URL ou téléverser depuis votre appareil."
          value={form.imageUrl}
          onChange={(url) => setForm({ ...form, imageUrl: url })}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button disabled={isPending} type="button" onClick={handleSave} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
          <Check size={16} /> {isPending ? "Enregistrement..." : t("admin.save")}
        </button>
        <button type="button" onClick={cancel} className="flex items-center gap-2 border-2 border-border px-5 py-3 rounded-2xl font-bold hover:bg-secondary transition-colors text-foreground">
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
          {serviceFormFields}
        </div>
      )}

      <div className="space-y-4">
        {services.map((s) => (
          <div key={s.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            {editing === s.id ? (
              <div className="p-5 md:p-6">
                <h3 className="font-extrabold mb-4 text-foreground">{t("admin.editSvc")}: {s.name}</h3>
                {serviceFormFields}
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center">
                {/* Service image thumbnail */}
                <div className="relative w-full md:w-24 h-24 flex-shrink-0 bg-secondary/30 flex items-center justify-center overflow-hidden">
                  {s.imageUrl ? (
                    <Image src={s.imageUrl} alt={s.name} fill sizes="(max-width: 768px) 100vw, 96px" className="object-cover" />
                  ) : (
                    <ImageIcon className="text-foreground/20 w-8 h-8" />
                  )}
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between flex-1 p-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-extrabold text-foreground">{s.name}</p>
                      {s.category && (
                        <span className="text-xs font-bold bg-secondary text-foreground/80 px-2 py-0.5 rounded-full">{s.category}</span>
                      )}
                    </div>
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
                    <button onClick={() => setConfirmDelete(s.id)} className="p-2 rounded-xl hover:bg-red-100 transition-colors text-foreground/40 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmModal 
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Supprimer ce service ?"
        message="Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible et il ne sera plus disponible pour la réservation."
        confirmText="Supprimer"
        type="danger"
        onConfirm={() => {
          if (confirmDelete) {
            startTransition(async () => {
              try {
                await deleteServiceAction(tenantId, domain, confirmDelete);
                addToast("Service supprimé", "success");
              } catch {
                addToast("Erreur", "error");
              }
              setConfirmDelete(null);
            });
          }
        }}
      />
    </div>
  );
}
