"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/components/i18n-provider";
import Link from "next/link";

export default function LoginPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Fetch the tenant domain for this user
      const { data: tenantData, error: tenantError } = await supabase
        .from("tenants")
        .select("subdomain")
        .eq("owner_id", authData.user.id)
        .single();

      if (tenantError) {
        // If they don't have a salon, check if they are a superadmin
        const { data: superadmin } = await supabase
          .from("superadmins")
          .select("id")
          .eq("user_id", authData.user.id)
          .single();

        if (superadmin) {
          window.location.href = "/superadmin";
          return;
        }
        // No salon and no superadmin role → send them to create a salon
        window.location.href = "/signup";
        return;
      }

      // 3. Redirect to their specific dashboard using token handoff
      //    Chrome blocks cookies from localhost → subdomain.localhost, so we
      //    pass the session tokens in the URL to a special page that sets the
      //    cookie directly on the subdomain.
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      const refreshToken = session?.refresh_token;

      const isLocal = window.location.hostname.includes("localhost");
      const isNip = window.location.hostname.includes("nip.io");
      
      if (isLocal || isNip) {
        const subdomain = tenantData.subdomain;
        window.location.href =
          `http://${subdomain}.${window.location.host}/auth/set-session` +
          `?access_token=${encodeURIComponent(accessToken ?? "")}` +
          `&refresh_token=${encodeURIComponent(refreshToken ?? "")}`;
      } else {
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
        window.location.href = `https://${tenantData.subdomain}.${rootDomain}/admin`;
      }

    } catch (err: unknown) {
      setError(t("saas.loginError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-lg">
        <h1 className="text-3xl font-black text-foreground text-center mb-2">{t("saas.loginTitle")}</h1>
        <p className="text-foreground/60 text-center mb-8">{t("saas.loginSub")}</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-600 font-bold p-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
            <input
              required
              type="password"
              className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary font-medium"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-extrabold text-lg p-4 rounded-xl shadow-md hover:opacity-90 disabled:opacity-50 mt-4 transition-opacity"
          >
            {loading ? t("saas.loggingIn") : t("saas.loginBtn")}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm font-medium text-foreground/60">
          {t("saas.noAccount")} <Link href="/signup" className="text-primary hover:underline">{t("saas.createAccount")}</Link>
        </div>
      </div>
    </div>
  );
}
