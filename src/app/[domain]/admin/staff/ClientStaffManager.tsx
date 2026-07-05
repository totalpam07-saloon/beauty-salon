"use client";

import { useState, useTransition } from "react";
import { useSalonStore, Staff } from "@/store/salon";
import { addStaffAction, updateStaffAction, deleteStaffAction } from "@/app/actions";
import { useI18n } from "@/components/i18n-provider";
import { ImageInput } from "@/components/image-input";
import { Plus, Pencil, Trash2, Check, X, User } from "lucide-react";
import Image from "next/image";
import { ConfirmModal } from "@/components/ConfirmModal";

type StaffForm = Omit<Staff, "id">;

const emptyForm: StaffForm = {
  name: "",
  role: "",
  imageUrl: "",
};

interface ClientStaffManagerProps {
  tenantId: string;
  domain: string;
  staffList: Staff[];
}

export default function ClientStaffManager({ tenantId, domain, staffList }: ClientStaffManagerProps) {
  const { t } = useI18n();
  const { addToast } = useSalonStore();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<StaffForm>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleSave = () => {
    startTransition(async () => {
      try {
        if (editing) {
          await updateStaffAction(tenantId, domain, editing, form);
          addToast(t("admin.staffEdited"), "success");
          setEditing(null);
        } else {
          await addStaffAction(tenantId, domain, { ...form, id: crypto.randomUUID() });
          addToast(t("admin.staffAdded"), "success");
          setAdding(false);
        }
        setForm(emptyForm);
      } catch (e) {
        addToast("Erreur", "error");
      }
    });
  };

  const startEdit = (s: Staff) => {
    setEditing(s.id);
    setAdding(false);
    setForm({
      name: s.name, 
      role: s.role, 
      imageUrl: s.imageUrl || "",
    });
  };

  const cancel = () => { setEditing(null); setAdding(false); setForm(emptyForm); };

  const inputClass = "w-full bg-background border-2 border-border rounded-2xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground";

  const staffFormFields = (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-bold text-foreground/60 ml-1 block">{t("admin.fullName")}</label>
        <input className={inputClass} placeholder="ex: Marie Dupont" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-foreground/60 ml-1 block">{t("admin.roleSpec")}</label>
        <input className={inputClass} placeholder="ex: Coiffeuse Experte" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
      </div>

      <div className="border-t border-border pt-4">
        <ImageInput
          label={t("portfolio.photoLabel")}
          hint={t("admin.staffPhotoHint")}
          value={form.imageUrl}
          onChange={(url) => setForm({ ...form, imageUrl: url })}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button disabled={isPending || !form.name || !form.role} type="button" onClick={handleSave} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
          <Check size={16} /> {isPending ? "Enregistrement..." : t("admin.save")}
        </button>
        <button type="button" onClick={cancel} className="flex items-center gap-2 border-2 border-border px-5 py-3 rounded-2xl font-bold hover:bg-secondary transition-colors text-foreground">
          <X size={16} /> {t("admin.cancel")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">{t("admin.navStaff")}</h1>
          <p className="text-foreground/50 mt-1">{t("admin.staffSub")}</p>
        </div>
        {!adding && !editing && (
          <button onClick={() => { setAdding(true); setForm(emptyForm); }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-2xl font-bold shadow hover:opacity-90 transition-opacity">
            <Plus size={18} /> {t("admin.staffAddBtn")}
          </button>
        )}
      </div>

      {adding && (
        <div className="bg-card border-2 border-primary rounded-3xl p-6 shadow-lg">
          <h2 className="text-lg font-extrabold text-foreground mb-4">{t("admin.newStaff")}</h2>
          {staffFormFields}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((s) => (
          <div key={s.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm relative">
            {editing === s.id ? (
              <div className="p-5 md:p-6">
                <h3 className="font-extrabold mb-4 text-foreground">Modifier: {s.name}</h3>
                {staffFormFields}
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="relative w-full h-48 bg-secondary/30 flex items-center justify-center">
                  {s.imageUrl ? (
                    <Image src={s.imageUrl} alt={s.name} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" />
                  ) : (
                    <User className="text-foreground/20 w-16 h-16" />
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button onClick={() => startEdit(s)} className="p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white text-black transition-colors shadow-sm">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => setConfirmDelete(s.id)} className="p-2 bg-white/80 backdrop-blur rounded-full hover:bg-red-50 text-red-600 transition-colors shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <p className="text-xl font-extrabold text-foreground">{s.name}</p>
                  <p className="text-sm font-bold text-foreground/50 mt-1 uppercase tracking-wider">{s.role}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmModal 
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title={t("admin.deleteStaffModalTitle")}
        message={t("admin.deleteStaffModalMsg")}
        confirmText={t("admin.deleteBtn")}
        type="danger"
        onConfirm={() => {
          if (confirmDelete) {
            startTransition(async () => {
              try {
                await deleteStaffAction(tenantId, domain, confirmDelete);
                addToast(t("admin.staffDeleted"), "success");
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
