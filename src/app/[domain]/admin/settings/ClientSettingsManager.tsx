"use client";

import { useState, useEffect, useTransition } from "react";
import { useSalonStore, SalonSettings } from "@/store/salon";
import { updateSettingsAction, updateTenantDomainAction } from "@/app/actions";
import { useI18n } from "@/components/i18n-provider";
import { Check, Settings, Clock, CreditCard, Palette, Crown } from "lucide-react";

import { TabGeneral } from "./components/TabGeneral";
import { TabHours } from "./components/TabHours";
import { TabPayments } from "./components/TabPayments";
import { TabAppearance } from "./components/TabAppearance";
import { TabBilling } from "./components/TabBilling";

type TabId = "general" | "hours" | "payments" | "appearance" | "billing";

interface ClientSettingsManagerProps {
  tenantId: string;
  domain: string;
  settings: SalonSettings;
  customDomainServer: string;
  tenantPayments: any[];
}

export default function ClientSettingsManager({ tenantId, domain, settings, customDomainServer, tenantPayments }: ClientSettingsManagerProps) {
  const { t } = useI18n();
  const { addToast } = useSalonStore();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<SalonSettings | null>(settings);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("general");
  
  const [customDomain, setCustomDomain] = useState(customDomainServer);
  const [savingDomain, setSavingDomain] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  const [domainStatus, setDomainStatus] = useState<any>(null);

  // Fetch initial domain status if a custom domain exists
  useEffect(() => {
    if (customDomainServer) {
      fetch(`/api/domains?domain=${customDomainServer}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) setDomainStatus(data);
        });
    }
  }, [customDomainServer]);

  const handleSaveDomain = () => {
    if (!tenantId) return;
    setSavingDomain(true);
    setDomainStatus(null);
    let cleanDomain = customDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Check if it's the root domain or empty
    if (!cleanDomain || cleanDomain.includes("koulakay.com") || cleanDomain.includes("crochetri.store") || cleanDomain.includes("localhost")) {
      cleanDomain = null as any;
    }

    startTransition(async () => {
      try {
        // 1. Save to database
        await updateTenantDomainAction(tenantId, domain, cleanDomain);
        
        if (cleanDomain) {
          // 2. Add to Vercel Project
          await fetch("/api/domains", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain: cleanDomain })
          });

          // 3. Fetch Verification Status
          const statusRes = await fetch(`/api/domains?domain=${cleanDomain}`);
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            setDomainStatus(statusData);
          }
        }
        
        addToast("Domaine mis à jour", "success");
      } catch (e) {
        console.error(e);
        addToast("Erreur lors de la sauvegarde", "error");
      }
      setSavingDomain(false);
    });
  };

  if (!form) return null;

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateSettingsAction(tenantId, domain, form);
        setSaved(true);
        addToast("Paramètres sauvegardés avec succès", "success");
        setTimeout(() => setSaved(false), 2000);
      } catch {
        addToast("Erreur", "error");
      }
    });
  };

  const tabs = [
    { id: "general", label: "Général", icon: Settings },
    { id: "appearance", label: "Apparence", icon: Palette },
    { id: "hours", label: "Horaires", icon: Clock },
    { id: "payments", label: "Paiements (Clients)", icon: CreditCard },
    { id: "billing", label: "Abonnement (SaaS)", icon: Crown },
  ] as const;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">{t("admin.navSettings")}</h1>
        <p className="text-foreground/50 mt-1">{t("admin.setSub")}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200 text-left ${
                activeTab === id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-foreground/70 hover:bg-secondary hover:text-foreground border border-border/50"
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
          
          <button disabled={isPending} onClick={handleSave}
            className={`mt-4 w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-extrabold text-lg transition-all duration-300 shadow-md disabled:opacity-50 ${
              saved ? "bg-green-500 text-white" : "bg-foreground text-background hover:opacity-90"
            }`}>
            {saved ? <><Check size={20} /> Enregistré</> : (isPending ? "Enregistrement..." : t("admin.saveBtn"))}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
          {activeTab === "general" && (
            <TabGeneral 
              form={form} 
              setForm={setForm} 
              customDomain={customDomain}
              setCustomDomain={setCustomDomain}
              savingDomain={savingDomain}
              handleSaveDomain={handleSaveDomain}
              domainStatus={domainStatus}
            />
          )}
          {activeTab === "appearance" && <TabAppearance form={form} setForm={setForm} />}
          {activeTab === "hours" && <TabHours form={form} setForm={setForm} />}
          {activeTab === "payments" && <TabPayments form={form} setForm={setForm} />}
          {activeTab === "billing" && (
            <TabBilling 
              tenantId={tenantId} 
              domain={domain} 
              tenantPayments={tenantPayments} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
