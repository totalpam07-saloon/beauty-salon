"use client";

import { Appointment, Service, SalonSettings } from "@/store/salon";
import { updateAppointmentStatusAction } from "@/app/actions";
import { useI18n } from "@/components/i18n-provider";
import { CheckCircle2, XCircle, Clock, CalendarCheck, Users, DollarSign, Link2, Copy, Scissors, Images, ChevronRight } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { ConfirmModal } from "@/components/ConfirmModal";

interface ClientAdminDashboardProps {
  tenantId: string;
  domain: string;
  services: Service[];
  settings: SalonSettings;
  appointments: Appointment[];
}

export default function ClientAdminDashboard({ tenantId, domain, services, settings, appointments }: ClientAdminDashboardProps) {
  const { t } = useI18n();
  const [isPending, startTransition] = useTransition();
  const [publicLink, setPublicLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: string, type: "approve" | "reject" } | null>(null);

  useEffect(() => {
    // Get the current origin (e.g. https://babas.koulakay.com or http://babas.localhost:3000)
    setPublicLink(window.location.origin);
  }, []);

  const handleCopy = () => {
    if (!publicLink) return;
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pending = appointments.filter((a) => a.status === "pending");
  const approved = appointments.filter((a) => a.status === "approved");
  const totalRevenue = approved.reduce((sum, a) => {
    const svc = services.find((s) => s.id === a.serviceId);
    if (!svc) return sum;
    return sum + (a.amountPaid.includes("USD") ? svc.depositFixedUSD : (svc.depositType === "percentage" ? svc.priceHTG * svc.depositPercentage / 100 : svc.depositFixedHTG));
  }, 0);

  const stats = [
    { label: t("admin.statPending"), value: pending.length, icon: Clock, color: "text-yellow-500" },
    { label: t("admin.statConfirmed"), value: approved.length, icon: CalendarCheck, color: "text-green-500" },
    { label: t("admin.statClients"), value: appointments.length, icon: Users, color: "text-primary" },
    { label: t("admin.statDeposits"), value: totalRevenue, icon: DollarSign, color: "text-accent" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">{t("admin.dashTitle")}</h1>
        <p className="text-foreground/50 font-medium mt-1">{t("admin.dashSub")}</p>
      </div>

      {/* Share Link Card */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
              <Link2 className="text-primary" size={20} />
              Lien de Réservation
            </h2>
            <p className="text-sm font-medium text-foreground/60 max-w-lg">
              C'est votre lien public. Partagez-le sur Instagram, Facebook ou WhatsApp pour que vos clients puissent prendre rendez-vous !
            </p>
          </div>

          <div className="flex items-center gap-2 bg-background border border-border rounded-2xl p-2 w-full md:w-auto">
            <input 
              type="text" 
              value={publicLink} 
              readOnly 
              className="bg-transparent border-none outline-none font-medium text-foreground/80 px-2 min-w-[250px] w-full text-sm"
            />
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                copied ? "bg-green-500 text-white" : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              {copied ? "Copié!" : "Copier"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-3xl p-5 shadow-sm flex flex-col gap-3">
            <Icon className={`w-7 h-7 ${color}`} />
            <div>
              <p className="text-2xl font-black text-foreground">{value}</p>
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-wide">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions (Mobile First) */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        <h2 className="text-xl font-extrabold text-foreground mt-4">Gestion du Salon</h2>
        
        <Link href="/admin/services" className="bg-primary/10 border-2 border-primary/20 rounded-3xl p-5 flex items-center justify-between group hover:bg-primary/20 transition-colors">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-sm">
              <Scissors size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Services & Prix</h3>
              <p className="text-sm font-medium text-foreground/60">Gérez vos prestations</p>
            </div>
          </div>
          <ChevronRight className="text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
        </Link>

        <Link href="/admin/portfolio" className="bg-secondary/30 border-2 border-border rounded-3xl p-5 flex items-center justify-between group hover:bg-secondary/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="bg-background text-foreground p-3 rounded-2xl shadow-sm border border-border">
              <Images size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Portfolio Photos</h3>
              <p className="text-sm font-medium text-foreground/60">Gérez votre vitrine</p>
            </div>
          </div>
          <ChevronRight className="text-foreground/50 group-hover:text-foreground transition-colors" />
        </Link>
      </div>

      {/* Analytics: Top Services */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hidden md:block">
        <h2 className="text-xl font-extrabold mb-4 text-foreground flex items-center gap-2">
          <DollarSign className="text-primary w-5 h-5" /> Services Populaires
        </h2>
        <div className="space-y-4">
          {(() => {
            const serviceCounts: Record<string, number> = {};
            approved.forEach(a => {
              serviceCounts[a.serviceName] = (serviceCounts[a.serviceName] || 0) + 1;
            });
            const sorted = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
            const max = sorted[0]?.[1] || 1;

            if (sorted.length === 0) return <p className="text-sm text-foreground/50">Pas assez de données.</p>;

            return sorted.map(([name, count]) => (
              <div key={name} className="space-y-1">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-foreground/80">{name}</span>
                  <span className="text-primary">{count} Réservations</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${(count / max) * 100}%` }} />
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Pending Appointments */}
      <div>
        <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
          <Clock className="text-yellow-500 w-5 h-5" /> {t("admin.reqPending")} ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <div className="bg-card border border-border rounded-3xl p-10 text-center text-foreground/40 font-medium">
            {t("admin.noPending")}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {pending.map((appt) => (
                <div key={appt.id} onClick={() => setSelectedAppointment(appt)} className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4 relative">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-black text-lg text-foreground">{appt.clientName}</h3>
                      <p className="text-sm font-medium text-foreground/70">{appt.clientPhone}</p>
                    </div>
                    {(appt.screenshotData || (appt.screenshotName && appt.screenshotName.startsWith('http'))) && (
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border shrink-0 shadow-sm" onClick={(e) => { e.stopPropagation(); setFullscreenImage(appt.screenshotData || appt.screenshotName); }}>
                        <Image src={appt.screenshotData || appt.screenshotName} alt="Receipt" fill sizes="48px" className="object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="bg-secondary/30 rounded-2xl p-3 border border-border">
                    <p className="font-bold text-foreground text-sm">{appt.serviceName}</p>
                    <p className="text-primary font-black text-sm">{appt.date} à {appt.time}</p>
                  </div>
                  <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setConfirmAction({ id: appt.id, type: "approve" })}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-sm">
                      <CheckCircle2 size={18} /> Approuver
                    </button>
                    <button onClick={() => setConfirmAction({ id: appt.id, type: "reject" })}
                      className="px-4 py-3 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-colors flex items-center justify-center">
                      <XCircle size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    <th className="p-4 font-bold text-foreground/70 text-sm">Client</th>
                    <th className="p-4 font-bold text-foreground/70 text-sm">Service & Date</th>
                    <th className="p-4 font-bold text-foreground/70 text-sm">Contact</th>
                    <th className="p-4 font-bold text-foreground/70 text-sm text-center">Reçu</th>
                    <th className="p-4 font-bold text-foreground/70 text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pending.map((appt) => (
                    <tr key={appt.id} onClick={() => setSelectedAppointment(appt)} className="hover:bg-secondary/40 transition-colors cursor-pointer group">
                      <td className="p-4 font-bold text-foreground">{appt.clientName}</td>
                      <td className="p-4">
                        <div className="font-bold text-foreground">{appt.serviceName}</div>
                        <div className="text-sm font-bold text-primary">{appt.date} à {appt.time}</div>
                      </td>
                      <td className="p-4 text-sm text-foreground/70">
                        <div className="font-medium text-foreground">{appt.clientPhone}</div>
                        <div className="text-xs">{appt.clientEmail}</div>
                      </td>
                      <td className="p-4 flex justify-center">
                        {(appt.screenshotData || (appt.screenshotName && appt.screenshotName.startsWith('http'))) ? (
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border shrink-0 hover:opacity-80 transition-opacity block bg-secondary/50 shadow-sm">
                            <Image src={appt.screenshotData || appt.screenshotName} alt="Receipt" fill sizes="48px" className="object-cover" />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-xl border border-border bg-secondary/30 flex items-center justify-center text-[10px] text-foreground/40 font-bold shrink-0 text-center">
                            {appt.screenshotName ? "Ancien" : "Aucun"}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setConfirmAction({ id: appt.id, type: "approve" })}
                            className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-sm text-sm">
                            <CheckCircle2 size={16} /> Approuver
                          </button>
                          <button onClick={() => setConfirmAction({ id: appt.id, type: "reject" })}
                            className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-2 rounded-xl font-bold hover:bg-red-200 transition-colors text-sm">
                            <XCircle size={16} /> Refuser
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )}
      </div>

      {/* Approved Appointments */}
      {approved.length > 0 && (
        <div>
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2 mt-8">
            <CalendarCheck className="text-green-500 w-5 h-5" /> {t("admin.confirmedAppts")} ({approved.length})
          </h2>
          
          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {approved.map((appt) => (
              <div key={appt.id} onClick={() => setSelectedAppointment(appt)} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-black text-foreground">{appt.clientName}</span>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-600 rounded-lg text-xs font-bold border border-green-500/20">
                    <CheckCircle2 size={12} /> Confirmé
                  </div>
                </div>
                <div className="bg-secondary/20 p-2.5 rounded-xl flex justify-between items-center">
                  <span className="text-sm font-bold text-foreground/80">{appt.serviceName}</span>
                  <span className="text-sm font-black text-primary">{appt.date} • {appt.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse opacity-90 min-w-[700px]">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    <th className="p-4 font-bold text-foreground/70 text-sm">Client</th>
                    <th className="p-4 font-bold text-foreground/70 text-sm">Service</th>
                    <th className="p-4 font-bold text-foreground/70 text-sm">Date & Heure</th>
                    <th className="p-4 font-bold text-foreground/70 text-sm text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {approved.map((appt) => (
                    <tr key={appt.id} onClick={() => setSelectedAppointment(appt)} className="hover:bg-secondary/40 transition-colors cursor-pointer">
                      <td className="p-4 font-bold text-foreground">{appt.clientName}</td>
                      <td className="p-4 text-sm font-bold text-foreground/80">{appt.serviceName}</td>
                      <td className="p-4 text-sm font-bold text-primary">{appt.date} à {appt.time}</td>
                      <td className="p-4 text-right">
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                          <CheckCircle2 size={12} /> {t("admin.confirmed")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedAppointment(null)}
        >
          <div 
            className="bg-card w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-border bg-secondary/30">
              <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                Détails du Rendez-vous
                {selectedAppointment.status === "approved" ? (
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Confirmé</span>
                ) : selectedAppointment.status === "pending" ? (
                  <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">En attente</span>
                ) : (
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Refusé</span>
                )}
              </h3>
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="text-foreground/50 hover:text-foreground transition-colors p-2"
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Client</p>
                    <p className="font-bold text-foreground text-lg">{selectedAppointment.clientName}</p>
                    <p className="text-sm font-medium text-foreground/70">{selectedAppointment.clientPhone}</p>
                    <p className="text-sm text-foreground/70">{selectedAppointment.clientEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Service & Date</p>
                    <p className="font-bold text-foreground">{selectedAppointment.serviceName}</p>
                    <p className="text-sm font-bold text-primary">{selectedAppointment.date} à {selectedAppointment.time}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Paiement</p>
                    <p className="font-bold text-foreground capitalize">Méthode: {selectedAppointment.paymentMethod}</p>
                    <p className="text-sm font-medium text-foreground/70">Montant Déclaré: <span className="font-bold text-accent">{selectedAppointment.amountPaid}</span></p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Reçu de paiement</p>
                    {(selectedAppointment.screenshotData || (selectedAppointment.screenshotName && selectedAppointment.screenshotName.startsWith('http'))) ? (
                      <button 
                        onClick={() => setFullscreenImage(selectedAppointment.screenshotData || selectedAppointment.screenshotName)} 
                        className="block mt-2 rounded-xl overflow-hidden border border-border shadow-sm hover:opacity-90 transition-opacity cursor-zoom-in w-full text-left"
                      >
                        <img src={selectedAppointment.screenshotData || selectedAppointment.screenshotName} alt="Receipt" className="w-full max-h-[300px] object-contain bg-secondary/50" />
                      </button>
                    ) : (
                      <div className="mt-2 h-24 rounded-xl border border-border bg-secondary/30 flex items-center justify-center text-xs text-foreground/40 font-bold">
                        {selectedAppointment.screenshotName ? "Ancien Reçu (Non supporté)" : "Aucun reçu"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            {selectedAppointment.status === "pending" && (
              <div className="p-6 border-t border-border bg-secondary/30 flex justify-end gap-3">
                <button 
                  onClick={() => { setConfirmAction({ id: selectedAppointment.id, type: "reject" }); setSelectedAppointment(null); }}
                  className="flex items-center gap-2 bg-red-100 text-red-600 px-6 py-3 rounded-2xl font-bold hover:bg-red-200 transition-colors"
                >
                  <XCircle size={18} /> Refuser
                </button>
                <button 
                  onClick={() => { setConfirmAction({ id: selectedAppointment.id, type: "approve" }); setSelectedAppointment(null); }}
                  className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-600 transition-colors shadow-sm"
                >
                  <CheckCircle2 size={18} /> Approuver
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setFullscreenImage(null)}
        >
          <button 
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/10 hover:bg-white/30 text-white rounded-full p-2 transition-colors z-[210]"
          >
            <XCircle size={36} />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={fullscreenImage} 
              alt="Fullscreen Receipt" 
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={confirmAction?.type === "approve" ? "Confirmer le rendez-vous" : "Refuser le rendez-vous"}
        message={confirmAction?.type === "approve" ? "Êtes-vous sûr de vouloir approuver et confirmer ce rendez-vous ?" : "Êtes-vous sûr de vouloir refuser ce rendez-vous ?"}
        confirmText={confirmAction?.type === "approve" ? "Approuver" : "Refuser"}
        type={confirmAction?.type === "approve" ? "success" : "danger"}
        onConfirm={() => {
          if (confirmAction) {
            startTransition(async () => {
              try {
                await updateAppointmentStatusAction(
                  tenantId, 
                  domain, 
                  confirmAction.id, 
                  confirmAction.type === "approve" ? "approved" : "rejected"
                );
              } catch (e) {
                console.error(e);
              }
            });
          }
        }}
      />
    </div>
  );
}
