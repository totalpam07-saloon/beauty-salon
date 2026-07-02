"use client";

import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "success" | "warning";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  type = "danger",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-card w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col p-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
            type === "danger" ? "bg-red-100 text-red-600" :
            type === "success" ? "bg-green-100 text-green-600" :
            "bg-yellow-100 text-yellow-600"
          }`}>
            {type === "danger" ? <AlertTriangle size={24} /> :
             type === "success" ? <CheckCircle2 size={24} /> :
             <AlertTriangle size={24} />}
          </div>
          <h3 className="text-xl font-extrabold text-foreground">{title}</h3>
        </div>

        <p className="text-foreground/70 font-medium mb-8">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-foreground hover:bg-secondary transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-white shadow-sm transition-colors flex items-center gap-2 ${
              type === "danger" ? "bg-red-500 hover:bg-red-600" :
              type === "success" ? "bg-green-500 hover:bg-green-600" :
              "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {type === "danger" ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
