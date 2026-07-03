"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useI18n } from "@/components/i18n-provider";
import { ImageInput } from "@/components/image-input";
import { Check, User as UserIcon, Lock, Mail, Save } from "lucide-react";
import { useSalonStore } from "@/store/salon";

export default function ProfilePage() {
  const { t } = useI18n();
  const supabase = createClient();
  const { addToast } = useSalonStore();
  const [user, setUser] = useState<User | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  
  // Status
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        setName(data.user.user_metadata?.name || "");
        setAvatarUrl(data.user.user_metadata?.avatar_url || "");
        setEmail(data.user.email || "");
      }
    });
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: name,
          avatar_url: avatarUrl,
        }
      });

      if (error) throw error;

      setSaved(true);
      addToast("Profil sauvegardé avec succès", "success");
      setTimeout(() => setSaved(false), 3000);
      
      // Reload page after a short delay to update the navbar avatar
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      addToast("Erreur lors de la sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-background border-2 border-border rounded-2xl px-4 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground";

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">{t("admin.profile")}</h1>
        <p className="text-foreground/50 mt-1">{t("admin.profileSub")}</p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
        
        {/* Avatar Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3 space-y-4">
            <h3 className="font-extrabold text-foreground flex items-center gap-2">
              <UserIcon size={20} className="text-primary" />
              {t("admin.avatar")}
            </h3>
            <p className="text-xs text-foreground/50">Apparaîtra dans le menu en haut à droite.</p>
          </div>
          <div className="w-full md:w-2/3">
            <div className="bg-background border-2 border-border border-dashed rounded-3xl p-4">
              <ImageInput
                label=""
                hint="Format carré recommandé (1:1)"
                value={avatarUrl}
                onChange={setAvatarUrl}
              />
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* Info Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3 space-y-4">
            <h3 className="font-extrabold text-foreground flex items-center gap-2">
              <Mail size={20} className="text-primary" />
              {t("admin.info")}
            </h3>
          </div>
          <div className="w-full md:w-2/3 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground/60 ml-1 block">{t("admin.fullName")}</label>
              <input 
                className={inputClass} 
                placeholder="Ex: Jean Dupont" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground/60 ml-1 block">{t("admin.emailAddress")}</label>
              <input 
                className={`${inputClass} opacity-50 cursor-not-allowed`} 
                value={email} 
                disabled 
                readOnly
                title="L'email ne peut pas être modifié pour le moment."
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-2xl p-4 text-sm font-bold">
            {error}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-extrabold text-lg transition-all duration-300 shadow-md ${
              saved ? "bg-green-500 text-white" : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {saving ? (
              "Enregistrement..."
            ) : saved ? (
              <><Check size={20} /> {t("admin.saved")}</>
            ) : (
              <><Save size={20} /> {t("admin.saveBtn")}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
