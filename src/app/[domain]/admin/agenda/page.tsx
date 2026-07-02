"use client";

import { useSalonStore } from "@/store/salon";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Phone } from "lucide-react";

export default function AgendaPage() {
  const { appointments } = useSalonStore();
  
  // Only show approved appointments in the agenda
  const approvedAppointments = appointments.filter(a => a.status === "approved");

  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)); // Monday
  startOfWeek.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-3">
            <CalendarIcon className="text-primary w-8 h-8" />
            Agenda
          </h1>
          <p className="text-foreground/60 font-medium">Gérez votre emploi du temps et vos rendez-vous confirmés.</p>
        </div>

        <div className="flex items-center gap-4 bg-card border border-border p-2 rounded-2xl shadow-sm w-fit">
          <button onClick={handlePrevWeek} className="p-2 hover:bg-secondary rounded-xl transition-all">
            <ChevronLeft size={20} />
          </button>
          <div className="font-bold text-sm min-w-[140px] text-center">
            {startOfWeek.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </div>
          <button onClick={handleNextWeek} className="p-2 hover:bg-secondary rounded-xl transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-border">
          {days.map((day, i) => {
            const dateStr = day.toISOString().split("T")[0];
            const dayAppointments = approvedAppointments
              .filter(a => a.date === dateStr)
              .sort((a, b) => a.time.localeCompare(b.time));

            return (
              <div key={i} className="min-h-[200px] md:min-h-[600px] bg-card p-4 flex flex-col">
                <div className={`text-center pb-4 mb-4 border-b border-border ${isToday(day) ? "text-primary" : "text-foreground/60"}`}>
                  <div className="font-bold uppercase text-xs tracking-wider mb-1">
                    {day.toLocaleDateString("fr-FR", { weekday: "short" })}
                  </div>
                  <div className={`text-2xl font-black ${isToday(day) ? "bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mx-auto shadow-md" : ""}`}>
                    {day.getDate()}
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-3 overflow-y-auto no-scrollbar">
                  {dayAppointments.length === 0 ? (
                    <div className="text-center text-xs text-foreground/40 py-4 font-medium italic">Aucun RDV</div>
                  ) : (
                    dayAppointments.map(apt => (
                      <div key={apt.id} className="bg-secondary/50 border border-border rounded-xl p-3 text-sm hover:border-primary/30 transition-all cursor-default">
                        <div className="font-bold text-primary flex items-center gap-1 mb-1 text-xs">
                          <Clock size={12} /> {apt.time}
                        </div>
                        <div className="font-bold text-foreground truncate mb-1" title={apt.serviceName}>
                          {apt.serviceName}
                        </div>
                        <div className="text-foreground/70 text-xs flex items-center gap-1 truncate mb-0.5">
                          <User size={12} /> {apt.clientName}
                        </div>
                        <div className="text-foreground/50 text-xs flex items-center gap-1">
                          <Phone size={12} /> {apt.clientPhone}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
