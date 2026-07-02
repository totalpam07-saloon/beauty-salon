"use client";

import { useState } from "react";
import { useSalonStore, PortfolioPhoto } from "@/store/salon";
import { useI18n } from "@/components/i18n-provider";
import { ImageInput } from "@/components/image-input";
import { Plus, Trash2, ExternalLink, X, Check, Edit2 } from "lucide-react";
import Image from "next/image";
import { ConfirmModal } from "@/components/ConfirmModal";

const uuid = () => crypto.randomUUID?.() ?? ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) => (c ^ (Math.random() * 16 >> c / 4)).toString(16));

export default function AdminPortfolioPage() {
  const { t } = useI18n();
  const { portfolio, addPortfolioPhoto, updatePortfolioPhoto, deletePortfolioPhoto, services, addToast } = useSalonStore();
  const [adding, setAdding] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [form, setForm] = useState({ imageUrl: "", category: "", caption: "", instagramUrl: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Category suggestions from services
  const categorySuggestions = services.map((s) => s.name);

  const handleSave = () => {
    if (!form.imageUrl || !form.category) return;
    if (editingPhotoId) {
      updatePortfolioPhoto(editingPhotoId, {
        imageUrl: form.imageUrl,
        category: form.category,
        caption: form.caption,
        instagramUrl: form.instagramUrl,
      });
      addToast("Photo modifiée avec succès", "success");
    } else {
      addPortfolioPhoto({
        id: uuid(),
        imageUrl: form.imageUrl,
        category: form.category,
        caption: form.caption,
        instagramUrl: form.instagramUrl,
        createdAt: new Date().toISOString(),
      });
      addToast("Nouvelle photo ajoutée", "success");
    }
    setForm({ imageUrl: "", category: "", caption: "", instagramUrl: "" });
    setAdding(false);
    setEditingPhotoId(null);
  };

  const inputClass = "w-full bg-background border-2 border-border rounded-2xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">{t("portfolio.adminTitle")}</h1>
          <p className="text-foreground/50 mt-1">{t("portfolio.adminSub")}</p>
        </div>
        {!adding && !editingPhotoId && (
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-2xl font-bold shadow hover:opacity-90 transition-opacity">
            <Plus size={18} /> {t("portfolio.addPhoto")}
          </button>
        )}
      </div>

      {/* Add Form */}
      {(adding || editingPhotoId) && (
        <div className="bg-card border-2 border-primary rounded-3xl p-6 shadow-lg space-y-4">
          <h2 className="text-lg font-extrabold text-foreground">{editingPhotoId ? "Modifier la Photo" : t("portfolio.newPhoto")}</h2>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/60 ml-1 block">{t("portfolio.category")}</label>
            <input className={inputClass} placeholder="ex: Knotless Braids, Silk Press, Makeup..." value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            {/* Quick category chips from services */}
            {categorySuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {categorySuggestions.map((s) => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, category: s })}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${form.category === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground/60 hover:border-primary/50"}`}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground/60 ml-1 block">{t("portfolio.caption")}</label>
            <input className={inputClass} placeholder="ex: Box braids 36 pouces..." value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
          </div>

          {/* Instagram Link */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground/60 ml-1 flex items-center gap-1.5">
              <ExternalLink size={13} /> {t("portfolio.igLink")}
            </label>
            <input className={inputClass} placeholder="https://instagram.com/p/..." value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} />
          </div>

          {/* Photo */}
          <div className="border-t border-border pt-4">
            <ImageInput
              label={t("portfolio.photoLabel")}
              hint="URL directe ou téléverser depuis votre appareil."
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={!form.imageUrl || !form.category}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
              <Check size={16} /> {t("admin.save")}
            </button>
            <button onClick={() => { setAdding(false); setEditingPhotoId(null); setForm({ imageUrl: "", category: "", caption: "", instagramUrl: "" }); }}
              className="flex items-center gap-2 border-2 border-border px-5 py-3 rounded-2xl font-bold hover:bg-secondary transition-colors text-foreground">
              <X size={16} /> {t("admin.cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      {portfolio.length === 0 && !adding ? (
        <div className="text-center py-20 text-foreground/30 font-medium border-2 border-dashed border-border rounded-3xl">
          <p className="text-lg">{t("portfolio.noPhotos")}</p>
          <p className="text-sm mt-1">Cliquez sur &ldquo;Ajouter une Photo&rdquo; pour commencer.</p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
          {portfolio.map((photo) => (
            <div key={photo.id} className="break-inside-avoid rounded-2xl overflow-hidden relative group shadow-sm">
              <Image 
                src={photo.imageUrl} 
                alt={photo.caption || photo.category} 
                width={0} 
                height={0} 
                sizes="(max-width: 640px) 100vw, 50vw" 
                style={{ width: '100%', height: 'auto' }} 
              />
              {/* Overlay info */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col items-start justify-between p-3">
                <div className="flex gap-2 self-end">
                  <button
                    onClick={() => {
                      setEditingPhotoId(photo.id);
                      setForm({
                        imageUrl: photo.imageUrl,
                        category: photo.category,
                        caption: photo.caption || "",
                        instagramUrl: photo.instagramUrl || "",
                      });
                      setAdding(false);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white rounded-full p-1.5 hover:bg-primary/90">
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(photo.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold text-xs bg-primary/80 px-2 py-0.5 rounded-full block w-fit">{photo.category}</span>
                  {photo.caption && <p className="text-white/90 text-xs mt-1 line-clamp-2">{photo.caption}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal 
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Supprimer cette photo ?"
        message="Cette action est irréversible et la photo sera retirée du portfolio public."
        confirmText={t("portfolio.delete")}
        type="danger"
        onConfirm={() => {
          if (deleteConfirm) {
            deletePortfolioPhoto(deleteConfirm);
            addToast("Photo supprimée", "success");
          }
        }}
      />
    </div>
  );
}
