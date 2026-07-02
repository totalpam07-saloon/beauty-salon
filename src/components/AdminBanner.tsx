"use client";

import { useSalonStore } from "@/store/salon";
import { AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AdminBanner() {
  const { planExpiresAt } = useSalonStore();
  const [status, setStatus] = useState<"warning" | "danger" | null>(null);
  const [message, setMessage] = useState("");
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    if (!planExpiresAt) return;
    
    const now = new Date();
    const expiry = new Date(planExpiresAt);
    const timeDiff = expiry.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setDaysLeft(daysDiff);

    if (daysDiff <= 0 && daysDiff >= -3) {
      // Grace period (expired but not locked yet)
      setStatus("danger");
      setMessage(`Abonnement expiré. Votre compte sera suspendu dans ${3 + daysDiff} jour(s). Veuillez payer immédiatement.`);
    } else if (daysDiff > 0 && daysDiff <= 3) {
      // Expiring soon
      setStatus("warning");
      setMessage(`Votre abonnement (ou période d'essai) expire dans ${daysDiff} jour(s).`);
    } else {
      setStatus(null);
    }
  }, [planExpiresAt]);

  if (!status) return null;

  return (
    <div className={`w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-semibold text-sm ${
      status === "danger" ? "bg-red-500 text-white" : "bg-yellow-400 text-yellow-900"
    }`}>
      <div className="flex items-center gap-3">
        {status === "danger" ? <AlertTriangle size={24} /> : <Clock size={24} />}
        <p>{message}</p>
      </div>
      <Link 
        href="/admin/settings" 
        className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${
          status === "danger" ? "bg-white text-red-600 hover:bg-red-50" : "bg-yellow-900 text-yellow-100 hover:bg-black hover:text-white"
        }`}
      >
        Renouveler maintenant
      </Link>
    </div>
  );
}
