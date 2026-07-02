"use client";

import { useState, useEffect } from "react";
import { useSalonStore, SalonSettings } from "@/store/salon";
import { useI18n } from "@/components/i18n-provider";
import { Check, Settings, Clock, CreditCard, Palette, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

import { TabGeneral } from "./components/TabGeneral";
import { TabHours } from "./components/TabHours";
import { TabPayments } from "./components/TabPayments";
import { TabAppearance } from "./components/TabAppearance";
import { TabBilling } from "./components/TabBilling";

type TabId = "general" | "hours" | "payments" | "appearance" | "billing";

export default function SettingsPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const { tenantId, settings, updateSettings, addToast } = useSalonStore();
  const [form, setForm] = useState<SalonSettings | null>(settings);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("general");
  
  const [customDomain, setCustomDomain] = useState("");
  const [savingDomain, setSavingDomain] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  useEffect(() => {
    if (tenantId) {
      supabase.from("tenants").select("domain").eq("id", tenantId).single().then(({ data }) => {
        if (data?.domain) setCustomDomain(data.domain);
      });
    }
  }, [tenantId]);

  const handleSaveDomain = async () => {
    if (!tenantId) return;
    setSavingDomain(true);
    let cleanDomain = customDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!cleanDomain) cleanDomain = null as any;
    await supabase.from("tenants").update({ domain: cleanDomain }).eq("id", tenantId);
    setSavingDomain(false);
    addToast("Domaine sauvegardé avec succès", "success");
  };

  if (!form) return null;

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    addToast("Paramètres sauvegardés avec succès", "success");
    setTimeout(() => setSaved(false), 2000);
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
          
          <button onClick={handleSave}
            className={`mt-4 w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-extrabold text-lg transition-all duration-300 shadow-md ${
              saved ? "bg-green-500 text-white" : "bg-foreground text-background hover:opacity-90"
            }`}>
            {saved ? <><Check size={20} /> Enregistré</> : t("admin.saveBtn")}
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
            />
          )}
          {activeTab === "appearance" && <TabAppearance form={form} setForm={setForm} />}
          {activeTab === "hours" && <TabHours form={form} setForm={setForm} />}
          {activeTab === "payments" && <TabPayments form={form} setForm={setForm} />}
          {activeTab === "billing" && <TabBilling />}
        </div>
      </div>
    </div>
  );
}
