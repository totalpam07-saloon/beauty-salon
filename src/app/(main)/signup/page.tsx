"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/components/i18n-provider";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [salonName, setSalonName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailExists, setEmailExists] = useState(false);
  const supabase = createClient();
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError(t("saas.passwordMismatch"));
      return;
    }

    setLoading(true);
    setError(null);
    setEmailExists(false);

    try {
      // 1. Create the Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        // Supabase returns this when the email is already registered
        if (
          authError.message?.toLowerCase().includes("already registered") ||
          authError.message?.toLowerCase().includes("user already exists") ||
          (authError as any).code === "user_already_exists" ||
          (authError as any).code === "identity_exists"
        ) {
          setEmailExists(true);
          return;
        }
        throw authError;
      }
      // Supabase quirk: when email confirmations are OFF and the email already exists,
      // signUp returns a fake user with identities=[] instead of an error.
      if (!authData.user || authData.user.identities?.length === 0) {
        setEmailExists(true);
        return;
      }
      
      // If email confirmation is required, session will be null
      if (!authData.session) {
        throw new Error(
          "Veuillez désactiver la confirmation d'email (Email Confirmations) dans les paramètres d'authentification de votre tableau de bord Supabase pour que la création automatique du salon fonctionne."
        );
      }

      // 2. Create the Tenant (Salon)
      const { data: tenantData, error: tenantError } = await supabase
        .from("tenants")
        .insert({
          owner_id: authData.user.id,
          subdomain: subdomain.toLowerCase().replace(/[^a-z0-9-]/g, ""),
          subscription_status: "active",
        })
        .select()
        .single();

      if (tenantError) {
        // If subdomain is taken, it will throw a unique constraint error
        if (tenantError.code === "23505") {
          throw new Error("Ce nom de domaine est déjà pris.");
        }
        throw tenantError;
      }

      // 3. Create default Salon Settings
      const { error: settingsError } = await supabase
        .from("salon_settings")
        .insert({
          tenant_id: tenantData.id,
          salon_name: salonName,
        });

      if (settingsError) throw settingsError;

      setSuccess(true);
      
      // Redirect to their new dashboard after 2 seconds
      setTimeout(() => {
        const isLocal = window.location.hostname.includes("localhost") || window.location.hostname.includes("nip.io");
        
        if (isLocal) {
          window.location.href = `http://${tenantData.subdomain}.${window.location.host}/admin`;
        } else {
          const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
          window.location.href = `https://${tenantData.subdomain}.${rootDomain}/admin`;
        }
      }, 1500);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card border-2 border-primary rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-black text-foreground">{t("saas.successTitle")}</h2>
          <p className="text-foreground/70">
            {t("saas.successDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-lg">
        <h1 className="text-3xl font-black text-foreground text-center mb-2">{t("saas.signupTitle")}</h1>
        <p className="text-foreground/60 text-center mb-8">{t("saas.signupSub")}</p>

        {emailExists && (
          <div className="bg-amber-500/10 border-2 border-amber-500 rounded-2xl p-4 mb-6 space-y-2">
            <p className="font-extrabold text-amber-600 text-sm">📧 Ce compte existe déjà.</p>
            <p className="text-foreground/70 text-sm">Vous avez déjà un compte avec cet email.</p>
            <div className="flex gap-3 pt-1">
              <a href="/login" className="flex-1 text-center bg-primary text-primary-foreground font-bold py-2 px-4 rounded-xl text-sm hover:opacity-90 transition-opacity">
                Se connecter
              </a>
              <a href="/forgot-password" className="flex-1 text-center bg-secondary text-foreground font-bold py-2 px-4 rounded-xl text-sm hover:bg-secondary/80 transition-colors border border-border">
                Mot de passe oublié?
              </a>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-600 font-bold p-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-foreground/60 ml-1 block mb-1">{t("saas.salonName")}</label>
            <input
              required
              className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary font-medium"
              placeholder="ex: Koul Akay Beauty"
              value={salonName}
              onChange={(e) => setSalonName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground/60 ml-1 block mb-1">{t("saas.domainLabel")}</label>
            <div className="flex items-center">
              <input
                required
                className="w-full bg-background border-2 border-r-0 rounded-l-xl border-border px-4 py-3 outline-none focus:border-primary font-medium"
                placeholder="koulakay"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              />
              <span className="bg-secondary/50 border-2 border-l-0 border-border rounded-r-xl px-4 py-3 font-bold text-foreground/50">
                .plateforme.com
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground/60 ml-1 block mb-1">{t("saas.email")}</label>
            <input
              required
              type="email"
              className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary font-medium"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground/60 ml-1 block mb-1">{t("saas.password")}</label>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                minLength={6}
                className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 pr-12 outline-none focus:border-primary font-medium"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-foreground/50 hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground/60 ml-1 block mb-1">{t("saas.confirmPassword")}</label>
            <div className="relative">
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                minLength={6}
                className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 pr-12 outline-none focus:border-primary font-medium"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-foreground/50 hover:text-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-extrabold text-lg p-4 rounded-xl shadow-md hover:opacity-90 disabled:opacity-50 mt-4 transition-opacity"
          >
            {loading ? t("saas.creating") : t("saas.cta")}
          </button>
        </form>
      </div>
    </div>
  );
}
