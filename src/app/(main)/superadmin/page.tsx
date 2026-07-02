"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Copy, CheckCircle2, Trash2, Shield, Activity, Users, Store, Link2 } from "lucide-react";

interface Tenant {
  id: string;
  subdomain: string;
  domain: string | null;
  subscription_status: "active" | "locked";
  plan_expires_at: string | null;
  created_at: string;
  salon_settings: { salon_name: string }[];
  appointments?: { count: number }[];
}

interface PendingPayment {
  id: string;
  tenant_id: string;
  amount: number;
  currency: string;
  receipt_url: string;
  created_at: string;
  tenants: {
    domain: string | null;
    subdomain: string;
    salon_settings: { salon_name: string }[];
  };
}

export default function SuperAdminPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingDomain, setEditingDomain] = useState<{id: string, current: string | null} | null>(null);
  const [newDomain, setNewDomain] = useState("");
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [fullscreenReceipt, setFullscreenReceipt] = useState<string | null>(null);
  const supabase = createClient();

  const fetchTenants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tenants")
      .select("*, salon_settings(salon_name), appointments(count)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTenants(data as unknown as Tenant[]);
    }
    setLoading(false);
  };

  const fetchPayments = async () => {
    const { data } = await supabase
      .from("tenant_payments")
      .select("*, tenants(domain, subdomain, salon_settings(salon_name))")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (data) setPayments(data as unknown as PendingPayment[]);
  };

  useEffect(() => {
    fetchTenants();
    fetchPayments();
  }, []);

  const refreshAll = () => {
    fetchTenants();
    fetchPayments();
  };

  const toggleSubscription = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "locked" : "active";
    await supabase.from("tenants").update({ subscription_status: newStatus }).eq("id", id);
    fetchTenants(); // Refresh
  };

  const deleteTenant = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce salon et toutes ses données ? Cette action est irréversible !")) return;
    
    setDeletingId(id);
    const { error } = await supabase.from("tenants").delete().eq("id", id);
    if (error) {
      alert("Erreur lors de la suppression. Veuillez vérifier les contraintes de base de données.");
    }
    setDeletingId(null);
    fetchTenants();
  };

  const copyOnboardingLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/signup`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveDomain = async () => {
    if (!editingDomain) return;
    const { error } = await supabase.from("tenants").update({ domain: newDomain || null }).eq("id", editingDomain.id);
    if (error) alert("Erreur: " + error.message);
    setEditingDomain(null);
    refreshAll();
  };

  const approvePayment = async (paymentId: string, tenantId: string) => {
    if (!window.confirm("Approuver ce paiement et étendre l'abonnement de 30 jours ?")) return;

    // 1. Mark payment as approved
    await supabase.from("tenant_payments").update({ status: "approved", approved_at: new Date().toISOString() }).eq("id", paymentId);
    
    // 2. Extend expiration date
    const { data: tenant } = await supabase.from("tenants").select("plan_expires_at").eq("id", tenantId).single();
    let currentExpiry = new Date();
    if (tenant?.plan_expires_at && new Date(tenant.plan_expires_at) > new Date()) {
      currentExpiry = new Date(tenant.plan_expires_at);
    }
    const newExpiry = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    await supabase.from("tenants").update({ plan_expires_at: newExpiry, subscription_status: "active" }).eq("id", tenantId);
    
    refreshAll();
  };

  const totalSalons = tenants.length;
  const activeSalons = tenants.filter(t => t.subscription_status === "active").length;
  const lockedSalons = tenants.filter(t => t.subscription_status === "locked").length;

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 pt-24 sm:pt-32">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Shield size={28} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">Mission Control</h1>
            </div>
            <p className="text-foreground/60 font-medium">Contrôlez et gérez l'ensemble de votre plateforme SaaS.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button onClick={copyOnboardingLink} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-background border-2 border-border text-foreground px-5 py-2.5 rounded-xl font-bold hover:border-primary/50 transition-colors shadow-sm">
              {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
              {copied ? "Lien copié !" : "Lien Onboarding"}
            </button>
            <button onClick={refreshAll} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:opacity-90 shadow-md">
              <Activity size={18} /> Rafraîchir
            </button>
          </div>
        </div>

        {/* Pending Payments Section */}
        {payments.length > 0 && (
          <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-3xl p-6">
            <h2 className="text-xl font-black text-yellow-700 flex items-center gap-2 mb-4">
              Paiements en attente ({payments.length})
            </h2>
            <div className="space-y-3">
              {payments.map(payment => {
                const salonName = payment.tenants?.salon_settings?.[0]?.salon_name || payment.tenants?.subdomain || "Salon inconnu";
                return (
                  <div key={payment.id} className="bg-white border border-yellow-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-extrabold text-foreground">{salonName}</p>
                      <p className="text-sm font-bold text-foreground/60">{payment.amount} {payment.currency}</p>
                      <p className="text-xs text-foreground/40">{new Date(payment.created_at).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setFullscreenReceipt(payment.receipt_url)}
                        className="px-4 py-2 bg-secondary text-foreground font-bold rounded-xl hover:bg-secondary/80 transition-colors"
                      >
                        Voir Reçu
                      </button>
                      <button 
                        onClick={() => approvePayment(payment.id, payment.tenant_id)}
                        className="px-4 py-2 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
                      >
                        Approuver
                      </button>
                      <button 
                        onClick={async () => {
                          if (window.confirm("Refuser ce paiement ?")) {
                            await supabase.from("tenant_payments").update({ status: "rejected" }).eq("id", payment.id);
                            refreshAll();
                          }
                        }}
                        className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Store size={80} />
            </div>
            <p className="text-sm font-bold text-foreground/50 mb-1 uppercase tracking-wider">Total Salons</p>
            <p className="text-5xl font-black text-foreground">{totalSalons}</p>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-green-500">
              <CheckCircle2 size={80} />
            </div>
            <p className="text-sm font-bold text-green-600/70 mb-1 uppercase tracking-wider">Salons Actifs</p>
            <p className="text-5xl font-black text-green-600">{activeSalons}</p>
          </div>
          
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-red-500">
              <Users size={80} />
            </div>
            <p className="text-sm font-bold text-red-600/70 mb-1 uppercase tracking-wider">Salons Verrouillés</p>
            <p className="text-5xl font-black text-red-600">{lockedSalons}</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="space-y-4">
          
          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {tenants.map((t) => {
              const salonName = t.salon_settings?.[0]?.salon_name || "En configuration...";
              const isLocked = t.subscription_status === "locked";
              const appointmentCount = t.appointments?.[0]?.count || 0;
              
              const isLocal = typeof window !== 'undefined' && window.location.hostname.includes("localhost");
              const isIp = typeof window !== 'undefined' && /^(\d{1,3}\.){3}\d{1,3}$/.test(window.location.hostname);
              const port = typeof window !== 'undefined' && window.location.port ? `:${window.location.port}` : "";
              let href = `https://${t.subdomain}.koulakay.com`;
              if (isLocal) href = `http://${t.subdomain}.localhost${port}`;
              else if (isIp) href = `http://${t.subdomain}.${window.location.hostname}.nip.io${port}`;

              return (
                <div key={t.id} className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-lg text-foreground">{salonName}</h3>
                      <a href={href} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium text-sm flex items-center gap-1 mt-1">
                        {t.subdomain} <Link2 size={12} />
                      </a>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${isLocked ? "bg-red-500/10 text-red-600 border border-red-500/20" : "bg-green-500/10 text-green-600 border border-green-500/20"}`}>
                      {isLocked ? "Impayé" : "Actif"}
                    </div>
                  </div>
                  
                  <div className="bg-secondary/30 rounded-2xl p-3 border border-border flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">RDVs</span>
                      <span className="font-black text-foreground">{appointmentCount}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Domaine</span>
                      <div className="flex items-center gap-2">
                        {t.domain ? (
                          <span className="text-sm font-bold text-foreground">{t.domain}</span>
                        ) : (
                          <span className="text-foreground/40 text-sm italic">Aucun</span>
                        )}
                        <button 
                          onClick={() => {
                            setEditingDomain({ id: t.id, current: t.domain });
                            setNewDomain(t.domain || "");
                          }}
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <Copy size={14} className="rotate-90" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <a 
                      href={`http://${t.subdomain}.localhost:3000/admin`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex justify-center items-center gap-2 bg-primary/10 text-primary py-3 rounded-xl font-bold hover:bg-primary/20 transition-colors text-sm shadow-sm"
                    >
                      <Users size={16} /> Impersonate
                    </a>
                    <button
                      onClick={() => toggleSubscription(t.id, t.subscription_status)}
                      className={`px-4 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center ${isLocked ? "bg-green-500 text-white hover:bg-green-600 shadow-green-500/20" : "bg-background border border-border text-foreground hover:border-red-500 hover:text-red-500"}`}
                    >
                      {isLocked ? "Réactiver" : "Verrouiller"}
                    </button>
                    <button
                      onClick={() => deleteTenant(t.id)}
                      disabled={deletingId === t.id}
                      className="px-4 py-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all flex items-center justify-center"
                    >
                      {deletingId === t.id ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={18} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block bg-card rounded-3xl border border-border overflow-hidden shadow-xl shadow-black/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-secondary/30 border-b border-border">
                  <th className="p-5 font-bold text-xs uppercase tracking-wider text-foreground/50">Salon & Lien</th>
                  <th className="p-5 font-bold text-xs uppercase tracking-wider text-foreground/50">Domaine Pro</th>
                  <th className="p-5 font-bold text-xs uppercase tracking-wider text-foreground/50">RDVs</th>
                  <th className="p-5 font-bold text-xs uppercase tracking-wider text-foreground/50">Statut</th>
                  <th className="p-5 font-bold text-xs uppercase tracking-wider text-foreground/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tenants.map((t) => {
                  const salonName = t.salon_settings?.[0]?.salon_name || "En configuration...";
                  const isLocked = t.subscription_status === "locked";
                  const appointmentCount = t.appointments?.[0]?.count || 0;
                  return (
                    <tr key={t.id} className="group hover:bg-secondary/20 transition-colors">
                      <td className="p-5">
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-foreground text-lg">{salonName}</span>
                          {(() => {
                            const isLocal = typeof window !== 'undefined' && window.location.hostname.includes("localhost");
                            const isIp = typeof window !== 'undefined' && /^(\d{1,3}\.){3}\d{1,3}$/.test(window.location.hostname);
                            const port = typeof window !== 'undefined' && window.location.port ? `:${window.location.port}` : "";
                            let href = `https://${t.subdomain}.koulakay.com`;
                            if (isLocal) href = `http://${t.subdomain}.localhost${port}`;
                            else if (isIp) href = `http://${t.subdomain}.${window.location.hostname}.nip.io${port}`;
                            
                            return (
                              <a href={href} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium text-sm flex items-center gap-1">
                                {t.subdomain} <Link2 size={12} />
                              </a>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          {t.domain ? (
                            <span className="bg-foreground/5 text-foreground px-3 py-1.5 rounded-lg text-sm font-bold border border-border">
                              {t.domain}
                            </span>
                          ) : (
                            <span className="text-foreground/30 text-sm font-bold italic">Aucun</span>
                          )}
                          <button 
                            onClick={() => {
                              setEditingDomain({ id: t.id, current: t.domain });
                              setNewDomain(t.domain || "");
                            }}
                            className="p-1.5 text-foreground/40 hover:text-primary transition-colors rounded-md opacity-0 group-hover:opacity-100"
                          >
                            <Copy size={14} className="rotate-90" /> {/* Using Copy as a placeholder for Edit/Settings icon if Pencil is missing */}
                          </button>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="font-black text-lg text-foreground/80">{appointmentCount}</span>
                      </td>
                      <td className="p-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${isLocked ? "bg-red-500/10 text-red-600 border border-red-500/20" : "bg-green-500/10 text-green-600 border border-green-500/20"}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isLocked ? "bg-red-500" : "bg-green-500"}`} />
                          {isLocked ? "Impayé" : "Actif"}
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          
                          <a 
                            href={`http://${t.subdomain}.localhost:3000/admin`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            <Users size={14} /> Impersonate
                          </a>

                          <button
                            onClick={() => toggleSubscription(t.id, t.subscription_status)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${isLocked ? "bg-green-500 text-white hover:bg-green-600 shadow-green-500/20" : "bg-background border border-border text-foreground hover:border-red-500 hover:text-red-500"}`}
                          >
                            {isLocked ? "Réactiver" : "Verrouiller"}
                          </button>
                          
                          <button
                            onClick={() => deleteTenant(t.id)}
                            disabled={deletingId === t.id}
                            className="p-2 rounded-xl border border-transparent text-foreground/40 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/10 transition-all"
                            title="Supprimer définitivement"
                          >
                            {deletingId === t.id ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {tenants.length === 0 && (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-foreground/30">
                <Store size={32} />
              </div>
              <h3 className="text-xl font-black text-foreground mb-2">Aucun salon n'est inscrit</h3>
              <p className="text-foreground/50 font-medium">Partagez votre lien d'onboarding pour commencer à recruter des salons.</p>
            </div>
          )}
        </div>
        </div>
      </div>
      {/* Domain Edit Modal */}
      {editingDomain && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-black text-foreground mb-4">Modifier le Domaine</h3>
            <p className="text-sm text-foreground/70 mb-4">
              Attribuez un domaine personnalisé (ex: monsalon.com) à ce salon. Laissez vide pour utiliser uniquement le sous-domaine.
            </p>
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="monsalon.com"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 mb-6 font-medium text-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setEditingDomain(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-foreground hover:bg-secondary transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={saveDomain}
                className="px-5 py-2.5 rounded-xl font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Receipt Modal */}
      {fullscreenReceipt && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setFullscreenReceipt(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-red-400 p-2 bg-black/50 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenReceipt(null);
            }}
          >
            <div className="w-8 h-8 flex items-center justify-center font-bold text-xl">X</div>
          </button>
          <img 
            src={fullscreenReceipt}
            alt="Reçu plein écran"
            className="w-full h-full object-contain cursor-zoom-out"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
