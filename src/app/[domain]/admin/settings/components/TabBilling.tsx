"use client";

import { useI18n } from "@/components/i18n-provider";
import { CheckCircle2, Lock, ExternalLink, AlertTriangle, Upload, X } from "lucide-react";
import { useSalonStore } from "@/store/salon";
import { useEffect, useState } from "react";
import { uploadImage } from "@/lib/supabase/storage";
import { ImageInput } from "@/components/image-input";

export function TabBilling() {
  const { t } = useI18n();
  const { planExpiresAt, tenantPayments, fetchTenantPayments, submitTenantPayment, addToast } = useSalonStore();
  const [submitting, setSubmitting] = useState(false);
  
  const [receiptUrl, setReceiptUrl] = useState("");
  const [currency, setCurrency] = useState<"USD" | "HTG">("USD");

  useEffect(() => {
    fetchTenantPayments();
  }, []);

  const handleSubmit = async () => {
    if (!receiptUrl) {
      addToast("Veuillez télécharger un reçu.", "error");
      return;
    }
    setSubmitting(true);
    await submitTenantPayment(currency === "USD" ? 20 : 2750, currency, receiptUrl);
    setReceiptUrl("");
    addToast("Paiement soumis avec succès. En attente d'approbation.", "success");
    setSubmitting(false);
  };

  const now = new Date();
  const expiry = planExpiresAt ? new Date(planExpiresAt) : null;
  const timeDiff = expiry ? expiry.getTime() - now.getTime() : 0;
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const isActive = daysDiff > 0;
  const isGrace = daysDiff <= 0 && daysDiff >= -3;
  const isExpired = daysDiff < -3;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm font-extrabold text-foreground/80 border-b border-border pb-2">⭐ Abonnement SaaS</p>
        
        {/* Current Plan Status */}
        <div className={`border-2 rounded-3xl p-6 flex items-start gap-4 ${
          isActive ? "bg-primary/10 border-primary/30" : 
          isGrace ? "bg-yellow-50 border-yellow-300" : 
          "bg-red-50 border-red-300"
        }`}>
          <div className={`p-3 rounded-2xl shadow-sm ${
            isActive ? "bg-primary text-primary-foreground" :
            isGrace ? "bg-yellow-500 text-white" :
            "bg-red-500 text-white"
          }`}>
            {isActive ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-foreground">
              {isActive ? "Plan Pro (Actif)" : isGrace ? "Abonnement Expiré (Période de grâce)" : "Abonnement Suspendu"}
            </h3>
            <p className="text-foreground/70 text-sm mt-1 font-medium">
              {isActive ? "Votre abonnement est actif. Vous avez accès à toutes les fonctionnalités premium." :
               isGrace ? `Votre abonnement est expiré. Veuillez payer dans les ${3 + daysDiff} jour(s) pour éviter une suspension.` :
               "Votre compte est suspendu. Veuillez effectuer un paiement pour réactiver votre accès."}
            </p>
            <div className={`mt-4 pt-4 border-t flex gap-4 text-sm font-bold ${
              isActive ? "border-primary/20" : isGrace ? "border-yellow-300/50" : "border-red-300/50"
            }`}>
              <div className="flex flex-col">
                <span className="text-foreground/50">{isActive ? "Prochain paiement" : "Expiré le"}</span>
                <span className="text-foreground">
                  {expiry ? expiry.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "Inconnu"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-foreground/50">Montant</span>
                <span className="text-foreground">$20 / mois (ou 2750 HTG)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment instructions */}
        <div className="bg-secondary/30 border border-border rounded-3xl p-6 mt-6">
          <h4 className="font-extrabold text-foreground mb-4 flex items-center gap-2">
            <Lock size={18} className="text-foreground/50" />
            Comment renouveler votre abonnement ?
          </h4>
          <p className="text-sm text-foreground/70 mb-4 font-medium">
            Pour renouveler votre abonnement, envoyez votre paiement à l'un des comptes ci-dessous, puis téléchargez le reçu.
          </p>
          <div className="space-y-3 mb-6">
            <div className="bg-background rounded-xl p-3 border border-border flex justify-between items-center">
              <span className="font-bold text-sm text-foreground/60">Zelle ($20 USD)</span>
              <span className="font-extrabold text-foreground">admin@koulakay.com</span>
            </div>
            <div className="bg-background rounded-xl p-3 border border-border flex justify-between items-center">
              <span className="font-bold text-sm text-foreground/60">MonCash (2750 HTG)</span>
              <span className="font-extrabold text-foreground">+509 3000-0000</span>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h5 className="font-bold text-foreground mb-4">Soumettre votre reçu</h5>
            <div className="flex gap-4 mb-4">
              <button 
                onClick={() => setCurrency("USD")}
                className={`flex-1 py-2 rounded-xl font-bold border-2 transition-colors ${currency === "USD" ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground/50"}`}
              >
                J'ai payé $20 (USD)
              </button>
              <button 
                onClick={() => setCurrency("HTG")}
                className={`flex-1 py-2 rounded-xl font-bold border-2 transition-colors ${currency === "HTG" ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground/50"}`}
              >
                J'ai payé 2750 HTG
              </button>
            </div>
            
            <ImageInput 
              value={receiptUrl}
              onChange={setReceiptUrl}
              bucket="receipts" // Reusing the same receipts bucket as clients
              placeholder="Télécharger le reçu de paiement"
            />

            <button 
              onClick={handleSubmit}
              disabled={submitting || !receiptUrl}
              className="mt-4 w-full bg-primary text-white py-3 rounded-2xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? "Envoi en cours..." : "Soumettre le paiement"}
            </button>
          </div>
        </div>

        {/* Payment History */}
        {tenantPayments.length > 0 && (
          <div className="mt-8">
            <h4 className="font-extrabold text-foreground mb-4">Historique des paiements</h4>
            <div className="space-y-3">
              {tenantPayments.map((payment) => (
                <div key={payment.id} className="bg-background border border-border rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">
                      {payment.amount} {payment.currency}
                    </p>
                    <p className="text-xs text-foreground/50">
                      {new Date(payment.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    {payment.status === "approved" ? (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase">Approuvé</span>
                    ) : payment.status === "rejected" ? (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase">Refusé</span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase">En attente</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
