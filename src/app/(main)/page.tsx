"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { createClient } from "@/lib/supabase/client";

export default function SaaSLandingPage() {
  const { t } = useI18n();
  const supabase = createClient();

  // If user is already logged in, redirect them to their proper dashboard
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check salon owner first (same logic as login page)
      const { data: tenant } = await supabase
        .from("tenants")
        .select("subdomain")
        .eq("owner_id", user.id)
        .single();

      if (tenant) {
        const isLocal = window.location.hostname.includes("localhost") || window.location.hostname.includes("nip.io");
        
        if (isLocal) {
          window.location.href = `http://${tenant.subdomain}.${window.location.host}/admin`;
        } else {
          const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
          window.location.href = `https://${tenant.subdomain}.${rootDomain}/admin`;
        }
        return;
      }

      // If no salon, check superadmin
      const { data: superadmin } = await supabase
        .from("superadmins")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (superadmin) {
        window.location.href = "/superadmin";
        return;
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="max-w-3xl text-center space-y-6 p-8">
        <h1 className="text-5xl font-black">
          {t("saas.heroTitle")} <span className="text-primary">{t("saas.heroAccent")}</span>
        </h1>
        <p className="text-xl opacity-70">
          {t("saas.heroSub")}
        </p>
        
        <div className="pt-8">
          <Link href="/signup" className="inline-block bg-primary text-primary-foreground font-bold text-xl px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-transform">
            {t("saas.cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
