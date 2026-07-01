"use client";

import { useSalonStore } from "@/store/salon";
import { useI18n } from "@/components/i18n-provider";
import { CheckCircle2, XCircle, Clock, CalendarCheck, Users, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const { t } = useI18n();
  const { appointments, services, settings, updateAppointmentStatus } = useSalonStore();

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
            {pending.map((appt) => (
              <div key={appt.id} className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row gap-4 md:items-center">
                <div className="flex-1 space-y-1">
                  <p className="text-lg font-extrabold text-foreground">{appt.clientName}</p>
                  <p className="text-sm font-medium text-foreground/60">{appt.serviceName}</p>
                  <p className="text-sm font-bold text-primary">{appt.date} à {appt.time}</p>
                  <p className="text-xs text-foreground/40">{appt.clientPhone} · {appt.clientEmail}</p>
                </div>

                {/* Screenshot preview */}
                <div className="bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-mono text-foreground/60 flex items-center gap-2">
                  📄 {appt.screenshotName || t("admin.receipt")}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button onClick={() => updateAppointmentStatus(appt.id, "approved")}
                    className="flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-2xl font-bold hover:bg-green-600 transition-colors shadow-sm">
                    <CheckCircle2 size={18} /> {t("admin.approve")}
                  </button>
                  <button onClick={() => updateAppointmentStatus(appt.id, "rejected")}
                    className="flex items-center gap-2 bg-red-100 text-red-600 px-5 py-3 rounded-2xl font-bold hover:bg-red-200 transition-colors">
                    <XCircle size={18} /> {t("admin.reject")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Appointments */}
      {approved.length > 0 && (
        <div>
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
            <CalendarCheck className="text-green-500 w-5 h-5" /> {t("admin.confirmedAppts")} ({approved.length})
          </h2>
          <div className="space-y-3">
            {approved.map((appt) => (
              <div key={appt.id} className="bg-card border border-border rounded-3xl p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 opacity-80">
                <div className="flex-1">
                  <p className="font-extrabold text-foreground">{appt.clientName}</p>
                  <p className="text-sm text-foreground/60">{appt.serviceName} · {appt.date} à {appt.time}</p>
                </div>
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                  <CheckCircle2 size={12} /> {t("admin.confirmed")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
