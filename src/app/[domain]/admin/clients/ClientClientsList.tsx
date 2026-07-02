"use client";

import { Appointment } from "@/store/salon";
import { useState, useMemo } from "react";
import { Users, Search, Phone, MessageCircle, Calendar, DollarSign, ExternalLink } from "lucide-react";

export default function ClientsPage({ appointments }: { appointments: Appointment[] }) {
  const [search, setSearch] = useState("");

  const clients = useMemo(() => {
    const clientMap = new Map<string, any>();

    appointments.forEach((apt) => {
      const phone = apt.clientPhone?.trim();
      if (!phone) return;

      if (!clientMap.has(phone)) {
        clientMap.set(phone, {
          phone,
          name: apt.clientName,
          email: apt.clientEmail,
          totalAppointments: 0,
          totalSpent: 0,
          lastAppointmentDate: apt.date,
          history: []
        });
      }

      const client = clientMap.get(phone);
      client.totalAppointments += 1;
      
      // Basic extraction of amount paid if it's a number string
      const amount = parseFloat(apt.amountPaid?.replace(/[^0-9.]/g, "") || "0");
      client.totalSpent += amount;

      // Keep most recent date
      if (new Date(apt.date) > new Date(client.lastAppointmentDate)) {
        client.lastAppointmentDate = apt.date;
        client.name = apt.clientName; // update to most recent name
      }

      client.history.push(apt);
    });

    return Array.from(clientMap.values()).sort((a, b) => b.totalAppointments - a.totalAppointments);
  }, [appointments]);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-3">
            <Users className="text-primary w-8 h-8" />
            Clients
          </h1>
          <p className="text-foreground/60 font-medium">Gérez votre base de données clients ({clients.length} au total).</p>
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
            Aucun client trouvé.
          </div>
        ) : (
          filteredClients.map((client) => {
            const cleanPhone = client.phone.replace(/[^0-9]/g, '');
            const waLink = `https://wa.me/${cleanPhone}`;
            
            return (
              <div key={client.phone} className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
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
                  <span className="text-xs font-bold text-foreground/60 uppercase tracking-wide">Dernier RDV</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Calendar size={14} className="text-primary" /> {client.lastAppointmentDate}
                  </div>
                </div>

                <a 
                  href={waLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
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
                <th className="p-4 font-bold text-foreground/70 text-sm">Client</th>
                <th className="p-4 font-bold text-foreground/70 text-sm">Contact</th>
                <th className="p-4 font-bold text-foreground/70 text-sm text-center">Rendez-vous</th>
                <th className="p-4 font-bold text-foreground/70 text-sm">Dernier RDV</th>
                <th className="p-4 font-bold text-foreground/70 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-foreground/50 font-medium">
                    Aucun client trouvé.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const cleanPhone = client.phone.replace(/[^0-9]/g, '');
                  const waLink = `https://wa.me/${cleanPhone}`;
                  
                  return (
                    <tr key={client.phone} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-foreground">{client.name}</div>
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
                          {client.lastAppointmentDate}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <a 
                          href={waLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
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
    </div>
  );
}
