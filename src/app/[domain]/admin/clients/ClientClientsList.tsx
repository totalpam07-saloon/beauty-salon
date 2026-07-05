"use client";

import { Appointment } from "@/store/salon";
import { useState, useMemo, useTransition } from "react";
import { Users, Search, Phone, MessageCircle, Calendar, DollarSign, X, Check, Save } from "lucide-react";
import { updateClientNotesAction } from "@/app/actions";
import { useSalonStore } from "@/store/salon";
import { useI18n } from "@/components/i18n-provider";

interface DbClient {
  id: string;
  phone: string;
  name: string;
  email: string;
  private_notes: string;
}

export default function ClientsPage({ 
  tenantId, 
  domain, 
  appointments,
  dbClients 
}: { 
  tenantId: string;
  domain: string;
  appointments: Appointment[];
  dbClients: DbClient[];
}) {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const { addToast } = useSalonStore();
  const { t } = useI18n();

  const clients = useMemo(() => {
    const clientMap = new Map<string, any>();

    // First initialize with any dbClients
    dbClients.forEach(dbClient => {
      clientMap.set(dbClient.phone, {
        phone: dbClient.phone,
        name: dbClient.name,
        email: dbClient.email,
        privateNotes: dbClient.private_notes || "",
        totalAppointments: 0,
        totalSpent: 0,
        lastAppointmentDate: "",
        history: []
      });
    });

    appointments.forEach((apt) => {
      const phone = apt.clientPhone?.trim();
      if (!phone) return;

      if (!clientMap.has(phone)) {
        clientMap.set(phone, {
          phone,
          name: apt.clientName,
          email: apt.clientEmail,
          privateNotes: "",
          totalAppointments: 0,
          totalSpent: 0,
          lastAppointmentDate: apt.date,
          history: []
        });
      }

      const client = clientMap.get(phone);
      client.totalAppointments += 1;
      
      const amount = parseFloat(apt.amountPaid?.replace(/[^0-9.]/g, "") || "0");
      client.totalSpent += amount;

      if (!client.lastAppointmentDate || new Date(apt.date) > new Date(client.lastAppointmentDate)) {
        client.lastAppointmentDate = apt.date;
        // Only override name if it wasn't set by DB client
        if (!dbClients.find(d => d.phone === phone)) {
          client.name = apt.clientName;
        }
      }

      client.history.push(apt);
    });

    return Array.from(clientMap.values()).sort((a, b) => b.totalAppointments - a.totalAppointments);
  }, [appointments, dbClients]);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  const openClientDetails = (client: any) => {
    setSelectedClient(client);
    setNotes(client.privateNotes);
  };

  const handleSaveNotes = () => {
    if (!selectedClient) return;
    
    startTransition(async () => {
      try {
        await updateClientNotesAction(
          tenantId, 
          domain, 
          selectedClient.phone, 
          selectedClient.name, 
          selectedClient.email || "", 
          notes
        );
        addToast(t("admin.notesSaved"), "success");
        // Update local state temporarily for snappy UI
        selectedClient.privateNotes = notes;
        setSelectedClient(null);
      } catch (e) {
        addToast("Erreur lors de l'enregistrement", "error");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-3">
            <Users className="text-primary w-8 h-8" />
            {t("admin.clientsTitle")}
          </h1>
          <p className="text-foreground/60 font-medium">{t("admin.clientsSub")} ({clients.length}).</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un client..." 
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredClients.length === 0 ? (
          <div className="bg-card border border-border rounded-3xl p-8 text-center text-foreground/50 font-medium">
            {t("admin.noClients")}
          </div>
        ) : (
          filteredClients.map((client) => {
            const cleanPhone = client.phone.replace(/[^0-9]/g, '');
            const waLink = `https://wa.me/${cleanPhone}`;
            
            return (
              <div key={client.phone} onClick={() => openClientDetails(client)} className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4 cursor-pointer hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-lg text-foreground">{client.name}</h3>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground/70 mt-1">
                      <Phone size={14} className="text-primary" /> {client.phone}
                    </div>
                  </div>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-black text-sm shrink-0">
                    {client.totalAppointments}
                  </span>
                </div>
                
                <div className="bg-secondary/30 rounded-2xl p-3 border border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground/60 uppercase tracking-wide">{t("admin.lastVisit")}</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Calendar size={14} className="text-primary" /> {client.lastAppointmentDate || "N/A"}
                  </div>
                </div>

                <a 
                  href={waLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold hover:bg-[#25D366]/90 transition-colors shadow-sm"
                >
                  <MessageCircle size={18} /> Contacter sur WhatsApp
                </a>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="p-4 font-bold text-foreground/70 text-sm">{t("admin.navClients")}</th>
                <th className="p-4 font-bold text-foreground/70 text-sm">Contact</th>
                <th className="p-4 font-bold text-foreground/70 text-sm text-center">{t("admin.totalVisits")}</th>
                <th className="p-4 font-bold text-foreground/70 text-sm">{t("admin.lastVisit")}</th>
                <th className="p-4 font-bold text-foreground/70 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-foreground/50 font-medium">
                    {t("admin.noClients")}
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const cleanPhone = client.phone.replace(/[^0-9]/g, '');
                  const waLink = `https://wa.me/${cleanPhone}`;
                  
                  return (
                    <tr key={client.phone} onClick={() => openClientDetails(client)} className="hover:bg-secondary/20 transition-colors cursor-pointer">
                      <td className="p-4">
                        <div className="font-bold text-foreground">{client.name}</div>
                        {client.privateNotes && (
                          <div className="text-xs text-foreground/50 mt-1 truncate max-w-[200px]">📝 {client.privateNotes}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                          <Phone size={14} className="text-primary" />
                          {client.phone}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {client.totalAppointments}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                          <Calendar size={14} className="text-foreground/50" />
                          {client.lastAppointmentDate || "N/A"}
                        </div>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button onClick={(e) => { e.stopPropagation(); openClientDetails(client); }} className="px-4 py-2 bg-secondary text-foreground hover:bg-secondary/80 font-bold text-sm rounded-xl transition-colors">
                          Détails
                        </button>
                        <a 
                          href={waLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 font-bold text-sm rounded-xl transition-colors"
                        >
                          <MessageCircle size={16} />
                          WhatsApp
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-[2rem] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-black text-foreground">{selectedClient.name}</h2>
                <div className="flex items-center gap-2 text-sm text-foreground/60 mt-1">
                  <Phone size={14} /> {selectedClient.phone}
                </div>
              </div>
              <button onClick={() => setSelectedClient(null)} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X size={24} className="text-foreground/60" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              
              {/* Private Notes */}
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
                  <Save size={18} className="text-primary" />
                  {t("admin.privateNotes")}
                </h3>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes sur les préférences, formules de coloration, etc..."
                  className="w-full min-h-[120px] bg-secondary/20 border border-border rounded-xl p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground resize-y"
                />
                <button 
                  disabled={isPending}
                  onClick={handleSaveNotes}
                  className="mt-3 flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Check size={18} /> {isPending ? "..." : t("admin.saveNotesBtn")}
                </button>
              </div>

              {/* History */}
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                  <Calendar size={18} className="text-primary" />
                  Historique des rendez-vous ({selectedClient.totalAppointments})
                </h3>
                <div className="space-y-3">
                  {selectedClient.history.length === 0 ? (
                    <p className="text-foreground/50 text-sm">Aucun rendez-vous trouvé.</p>
                  ) : (
                    selectedClient.history.slice().reverse().map((apt: Appointment, idx: number) => (
                      <div key={idx} className="bg-background border border-border p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-foreground">{apt.serviceName}</p>
                          <p className="text-xs font-medium text-foreground/60 mt-1">{apt.date} à {apt.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-primary">{apt.amountPaid || "N/A"}</p>
                          <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                            apt.status === "approved" ? "bg-green-100 text-green-700" :
                            apt.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
