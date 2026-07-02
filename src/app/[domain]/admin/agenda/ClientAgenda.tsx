"use client";

import { Appointment } from "@/store/salon";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Phone, LayoutList, CalendarDays } from "lucide-react";

export default function ClientAgenda({ appointments }: { appointments: Appointment[] }) {
  
  // Only show approved appointments in the agenda
  const approvedAppointments = appointments.filter(a => a.status === "approved");

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

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
    // Also move selected date back a week
    const newSelected = new Date(selectedDate);
    newSelected.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newSelected);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
    // Also move selected date forward a week
    const newSelected = new Date(selectedDate);
    newSelected.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newSelected);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();
  };

  const selectedDateStr = selectedDate.toISOString().split("T")[0];
  const selectedDayAppointments = approvedAppointments
    .filter(a => a.date === selectedDateStr)
    .sort((a, b) => a.time.localeCompare(b.time));

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
          <div className="font-bold text-sm min-w-[140px] text-center capitalize">
            {startOfWeek.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </div>
          <button onClick={handleNextWeek} className="p-2 hover:bg-secondary rounded-xl transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* MOBILE ONLY: View Mode Toggle */}
      <div className="md:hidden flex bg-secondary rounded-2xl p-1 w-full max-w-sm mx-auto shadow-inner">
        <button 
          onClick={() => setViewMode("daily")}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${viewMode === 'daily' ? 'bg-primary text-primary-foreground shadow-md' : 'text-foreground/60 hover:text-foreground'}`}
        >
          <CalendarDays size={16} /> Jour
        </button>
        <button 
          onClick={() => setViewMode("weekly")}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${viewMode === 'weekly' ? 'bg-primary text-primary-foreground shadow-md' : 'text-foreground/60 hover:text-foreground'}`}
        >
          <LayoutList size={16} /> Semaine
        </button>
      </div>

      {/* MOBILE ONLY: Daily View */}
      {viewMode === "daily" && (
        <div className="md:hidden space-y-4">
          {/* Horizontal Date Scroller */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
            {days.map((day, i) => {
              const selected = isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);
              
              return (
                <button 
                  key={i} 
                  onClick={() => setSelectedDate(day)}
                  className={`min-w-[65px] flex-shrink-0 p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border ${selected ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105' : 'bg-card text-foreground/70 border-border hover:bg-secondary'}`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${selected ? 'text-primary-foreground/80' : isCurrentDay ? 'text-primary' : ''}`}>
                    {day.toLocaleDateString("fr-FR", { weekday: "short" }).replace('.', '')}
                  </span>
                  <span className={`text-xl font-black ${isCurrentDay && !selected ? 'text-primary' : ''}`}>
                    {day.getDate()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Day Details */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm min-h-[300px]">
            <h2 className="font-extrabold text-lg mb-4 flex items-center justify-between border-b border-border pb-3">
              <span className="capitalize">{selectedDate.toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                {selectedDayAppointments.length} RDV
              </span>
            </h2>

            <div className="space-y-3">
              {selectedDayAppointments.length === 0 ? (
                <div className="text-center flex flex-col items-center justify-center py-10 opacity-50">
                  <CalendarDays size={48} className="mb-3 text-foreground/30" />
                  <p className="font-bold">Aucun rendez-vous</p>
                  <p className="text-xs mt-1">Profitez de votre journée libre !</p>
                </div>
              ) : (
                selectedDayAppointments.map(apt => (
                  <div key={apt.id} className="bg-secondary/30 border border-border rounded-2xl p-4 hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-black text-primary flex items-center gap-1.5 text-sm bg-primary/10 px-2.5 py-1 rounded-lg w-fit">
                        <Clock size={14} /> {apt.time}
                      </div>
                      <div className="text-xs font-bold text-foreground/60">{apt.serviceName}</div>
                    </div>
                    
                    <div className="mt-3 space-y-1.5">
                      <div className="font-bold text-foreground flex items-center gap-2 text-sm">
                        <User size={14} className="text-foreground/50" /> {apt.clientName}
                      </div>
                      <div className="text-foreground/70 text-xs flex items-center gap-2 font-medium">
                        <Phone size={14} className="text-foreground/50" /> {apt.clientPhone}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE ONLY: Weekly View (Condensed) */}
      {viewMode === "weekly" && (
        <div className="md:hidden space-y-4">
          <div className="bg-card border border-border rounded-3xl p-4 shadow-sm space-y-4">
            {days.map((day, i) => {
              const dateStr = day.toISOString().split("T")[0];
              const dayAppointments = approvedAppointments
                .filter(a => a.date === dateStr)
                .sort((a, b) => a.time.localeCompare(b.time));

              return (
                <div key={i} className={`flex gap-4 ${i !== days.length - 1 ? 'border-b border-border pb-4' : ''}`}>
                  <div className="flex flex-col items-center min-w-[45px]">
                    <span className="text-[10px] font-bold uppercase text-foreground/50">{day.toLocaleDateString("fr-FR", { weekday: "short" }).replace('.', '')}</span>
                    <span className={`text-lg font-black ${isToday(day) ? 'text-primary' : ''}`}>{day.getDate()}</span>
                  </div>
                  
                  <div className="flex-1 space-y-2 pt-1">
                    {dayAppointments.length === 0 ? (
                      <div className="text-xs text-foreground/40 font-medium italic mt-1">Aucun RDV</div>
                    ) : (
                      dayAppointments.map(apt => (
                        <div key={apt.id} className="bg-secondary/50 border border-border rounded-xl px-3 py-2 flex items-center justify-between">
                          <div className="font-bold text-primary text-xs">{apt.time}</div>
                          <div className="text-xs font-bold truncate max-w-[120px] text-foreground/80">{apt.clientName}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DESKTOP ONLY: Full Grid View */}
      <div className="hidden md:block bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 divide-x divide-border">
          {days.map((day, i) => {
            const dateStr = day.toISOString().split("T")[0];
            const dayAppointments = approvedAppointments
              .filter(a => a.date === dateStr)
              .sort((a, b) => a.time.localeCompare(b.time));

            return (
              <div key={i} className="min-h-[600px] bg-card p-4 flex flex-col hover:bg-secondary/10 transition-colors">
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
                      <div key={apt.id} className="bg-secondary/50 border border-border rounded-xl p-3 text-sm hover:border-primary/50 transition-all cursor-default shadow-sm hover:shadow">
                        <div className="font-bold text-primary flex items-center gap-1 mb-1 text-xs bg-primary/5 w-fit px-2 py-0.5 rounded-md">
                          <Clock size={12} /> {apt.time}
                        </div>
                        <div className="font-bold text-foreground truncate mb-1" title={apt.serviceName}>
                          {apt.serviceName}
                        </div>
                        <div className="text-foreground/70 text-xs flex items-center gap-1.5 truncate mb-0.5">
                          <User size={12} /> {apt.clientName}
                        </div>
                        <div className="text-foreground/50 text-[11px] flex items-center gap-1.5 mt-1 border-t border-border/50 pt-1">
                          <Phone size={10} /> {apt.clientPhone}
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
