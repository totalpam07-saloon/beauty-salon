"use client";

import { useI18n } from "@/components/i18n-provider";
import { SalonSettings } from "@/store/salon";
import { Check } from "lucide-react";

export function TabAppearance({
  form,
  setForm,
}: {
  form: SalonSettings;
  setForm: (v: any) => void;
}) {
  const { t } = useI18n();

  const themes = [
    { id: "soft", name: "🌸 Soft (Rose)", color: "#E8A598" },
    { id: "dark", name: "🌙 Dark (Or)", color: "#D4AF37" },
    { id: "earthy", name: "🌿 Earthy (Vert)", color: "#556B2F" },
    { id: "custom", name: "🎨 Sur mesure", color: form.customThemeColor || "#6366f1" },
  ];

  const currentTheme = form.theme || "soft";

  return (
    <div className="space-y-8">
      {/* Template Selection */}
      <div className="space-y-4">
        <p className="text-sm font-extrabold text-foreground/80 border-b border-border pb-2">Modèle de site (Template)</p>
        <p className="text-xs text-foreground/60 mb-4">Choisissez la structure et le design de votre site de réservation.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: "classic", name: "📱 Classique", desc: "Design standard et épuré" },
            { id: "luxe", name: "✨ Midnight Luxe", desc: "Sombre, élégant, fort contraste" },
            { id: "spa", name: "🌿 Spa Minimaliste", desc: "Aéré, doux, tons pastel" },
            { id: "pop", name: "🎨 Pop Vibrant", desc: "Audacieux, brutaliste, Gen-Z" },
            { id: "editorial", name: "📰 Éditorial", desc: "Haute couture, noir & blanc" },
            { id: "playful", name: "🫧 Playful", desc: "Doux, très coloré, effet verre (iOS)" },
            { id: "retro", name: "🌻 Rétro Pop", desc: "Années 70, chaleureux et original" },
          ].map((template) => {
            const isSelected = (form.templateId || 'classic') === template.id;
            return (
              <button
                key={template.id}
                onClick={() => setForm({ ...form, templateId: template.id })}
                className={`relative flex flex-col items-start p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-background"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>{template.name}</span>
                  {isSelected && <Check className="text-primary" size={20} />}
                </div>
                <span className="text-xs text-foreground/60">{template.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-extrabold text-foreground/80 border-b border-border pb-2">Couleur d'accent (Thème)</p>
        <p className="text-xs text-foreground/60 mb-4">Choisissez la couleur principale pour les boutons et icônes (s'applique à tous les modèles).</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {themes.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setForm({ ...form, theme: theme.id })}
                className={`relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full shadow-inner border border-black/10" style={{ backgroundColor: theme.color }} />
                  <span className={`font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>{theme.name}</span>
                </div>
                {isSelected && <Check className="text-primary" size={20} />}
              </button>
            );
          })}
        </div>

        {currentTheme === "custom" && (
          <div className="mt-6 p-6 bg-secondary/30 rounded-2xl border border-border animate-in fade-in slide-in-from-top-2">
            <label className="text-sm font-bold text-foreground block mb-2">Choisissez votre couleur principale :</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={form.customThemeColor || "#6366f1"}
                onChange={(e) => setForm({ ...form, customThemeColor: e.target.value })}
                className="w-16 h-16 p-1 rounded-xl bg-background border-2 border-border cursor-pointer"
              />
              <div className="flex-1">
                <input 
                  type="text" 
                  value={form.customThemeColor || "#6366f1"}
                  onChange={(e) => setForm({ ...form, customThemeColor: e.target.value })}
                  className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 outline-none font-mono text-sm focus:border-primary"
                />
              </div>
            </div>
            <p className="text-xs text-foreground/50 mt-3">Cette couleur sera utilisée pour les boutons, les icônes, et les accents de votre site.</p>
          </div>
        )}
      </div>
    </div>
  );
}
