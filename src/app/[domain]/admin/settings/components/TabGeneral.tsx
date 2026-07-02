"use client";

import { useI18n } from "@/components/i18n-provider";
import { ImageInput } from "@/components/image-input";
import { SalonSettings } from "@/store/salon";

export function TabGeneral({
  form,
  setForm,
  customDomain,
  setCustomDomain,
  savingDomain,
  handleSaveDomain,
}: {
  form: SalonSettings;
  setForm: (v: any) => void;
  customDomain: string;
  setCustomDomain: (v: string) => void;
  savingDomain: boolean;
  handleSaveDomain: () => void;
  domainStatus?: any;
}) {
  const { t } = useI18n();
  const inputClass = "w-full bg-background border-2 border-border rounded-2xl px-4 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground";

  return (
    <div className="space-y-8">
      {/* Salon Identity */}
      <div className="space-y-4">
        <p className="text-sm font-extrabold text-foreground/80 border-b border-border pb-2">🏪 Identité du Salon</p>
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/60 ml-1 block">{t("admin.salonName")}</label>
          <input className={inputClass} value={form.salonName} onChange={(e) => setForm({ ...form, salonName: e.target.value })} />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/60 ml-1 block flex justify-between">
            <span>Slogan / Description (SEO)</span>
            <span className={`${(form.description?.length || 0) > 160 ? "text-red-500" : "text-foreground/40"}`}>{form.description?.length || 0}/160</span>
          </label>
          <textarea 
            className={`${inputClass} min-h-[80px] resize-y`} 
            maxLength={160}
            placeholder="Ex: The best braids and locs in town!" 
            value={form.description || ""} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
          />
          <p className="text-[10px] text-foreground/40 ml-1 font-medium">This text appears when you share your link on WhatsApp, Instagram, or Google.</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/60 ml-1 block">Adresse Physique</label>
          <textarea className={`${inputClass} min-h-[80px] resize-y`} placeholder="Ex: 123 Rue de la Paix, Port-au-Prince" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/60 ml-1 block">Domaine Personnalisé (Optionnel)</label>
          <div className="flex gap-2">
            <input 
              className={inputClass} 
              placeholder="ex: www.monsalon.com" 
              value={customDomain} 
              onChange={(e) => setCustomDomain(e.target.value)} 
            />
            <button 
              onClick={handleSaveDomain}
              disabled={savingDomain}
              className="bg-secondary text-secondary-foreground font-bold px-6 rounded-2xl hover:opacity-90 transition-opacity"
            >
              {savingDomain ? "..." : "Enregistrer"}
            </button>
          </div>
          <p className="text-xs text-foreground/50 ml-1">Connectez votre propre nom de domaine. (Ex: www.koulakay.com)</p>
          
          {domainStatus && (
            <div className={`mt-4 p-4 rounded-xl border ${domainStatus.verified ? 'bg-green-500/10 border-green-500/50' : 'bg-yellow-500/10 border-yellow-500/50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${domainStatus.verified ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                <span className="font-bold text-sm">
                  {domainStatus.verified ? "Domaine Connecté et Sécurisé" : "Configuration DNS Requise"}
                </span>
              </div>
              
              {!domainStatus.verified && (
                <div className="text-sm text-foreground/80 space-y-3 mt-3">
                  <p>Pour finaliser la connexion, ajoutez cet enregistrement DNS chez votre registraire (GoDaddy, Hostinger, etc.) :</p>
                  
                  {customDomain.startsWith('www.') || customDomain.split('.').length > 2 ? (
                    <div className="bg-background border border-border p-3 rounded-lg font-mono text-xs">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-foreground/50">Type</span>
                        <span className="text-foreground/50">Nom / Host</span>
                        <span className="text-foreground/50">Valeur / Cible</span>
                        
                        <span className="font-bold">CNAME</span>
                        <span className="font-bold">{customDomain.split('.')[0]}</span>
                        <span className="font-bold">cname.vercel-dns.com</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-background border border-border p-3 rounded-lg font-mono text-xs">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-foreground/50">Type</span>
                        <span className="text-foreground/50">Nom / Host</span>
                        <span className="text-foreground/50">Valeur / Cible</span>
                        
                        <span className="font-bold">A Record</span>
                        <span className="font-bold">@</span>
                        <span className="font-bold">76.76.21.21</span>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs opacity-70">Note: La propagation DNS peut prendre jusqu'à 24 heures, mais cela prend généralement moins de 10 minutes. Cliquez sur Enregistrer pour vérifier le statut à nouveau.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logo */}
        <ImageInput
          label="Logo du salon"
          hint="Apparaît dans la barre de navigation."
          value={form.logoUrl}
          onChange={(url) => setForm({ ...form, logoUrl: url })}
        />

        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/60 ml-1 block">Affichage dans l'en-tête (Navbar)</label>
          <select 
            className={inputClass}
            value={form.headerDisplay || "both"}
            onChange={(e) => setForm({ ...form, headerDisplay: e.target.value as any })}
          >
            <option value="both">Logo et Nom du Salon</option>
            <option value="logo">Logo uniquement</option>
            <option value="name">Nom du Salon uniquement</option>
          </select>
        </div>

        {/* Banner */}
        <ImageInput
          label="Photo bannière (Hero)"
          hint="Grande photo en arrière-plan de la page d'accueil."
          value={form.bannerUrl}
          onChange={(url) => setForm({ ...form, bannerUrl: url })}
        />
      </div>

      {/* Social Media */}
      <div className="space-y-4">
        <p className="text-sm font-extrabold text-foreground/80 border-b border-border pb-2">🌐 Réseaux Sociaux & Contact</p>
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/60 ml-1 block">Instagram URL</label>
          <input className={inputClass} placeholder="https://instagram.com/votresalon" value={form.instagramUrl || ""} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/60 ml-1 block">Facebook URL</label>
          <input className={inputClass} placeholder="https://facebook.com/votresalon" value={form.facebookUrl || ""} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/60 ml-1 block">TikTok URL</label>
          <input className={inputClass} placeholder="https://tiktok.com/@votresalon" value={form.tiktokUrl || ""} onChange={(e) => setForm({ ...form, tiktokUrl: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/60 ml-1 block">Numéro WhatsApp</label>
          <input className={inputClass} placeholder="+509 XXXX-XXXX" value={form.whatsappNumber || ""} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/60 ml-1 block">Style du bouton WhatsApp</label>
          <select 
            className={`${inputClass} appearance-none bg-no-repeat`} 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
            value={form.whatsappVisibility || "floating"} 
            onChange={(e) => setForm({ ...form, whatsappVisibility: e.target.value as any })}
          >
            <option value="floating">Flottant (Bouton sur toutes les pages)</option>
            <option value="inline">Intégré (Dans les détails des services et portfolio)</option>
            <option value="hidden">Masqué (Ne pas afficher de bouton WhatsApp)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
