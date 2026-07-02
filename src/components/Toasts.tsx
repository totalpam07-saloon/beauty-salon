"use client";

import { useSalonStore } from "@/store/salon";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

export function Toasts() {
  const { toasts, removeToast } = useSalonStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className="bg-card border border-border shadow-2xl rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top-2 fade-in duration-300"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === "success" && <CheckCircle2 className="text-green-500" size={20} />}
            {toast.type === "error" && <XCircle className="text-red-500" size={20} />}
            {toast.type === "info" && <AlertCircle className="text-blue-500" size={20} />}
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">{toast.message}</p>
          </div>

          <button 
            onClick={() => removeToast(toast.id)}
            className="text-foreground/40 hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
