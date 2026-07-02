"use client";

import Link from "next/link";
import { useI18n } from "./i18n-provider";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Shield, LogIn, LayoutDashboard, LogOut } from "lucide-react";

export function SaaSNavbar() {
  const { language, setLanguage, t } = useI18n();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav className="border-b border-border/50 bg-background/70 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black text-primary tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <Shield size={24} />
          </div>
          Salon<span className="text-foreground">SaaS</span>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-secondary/50 p-1.5 rounded-2xl border border-border/50">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-xs font-bold outline-none cursor-pointer text-foreground/70 hover:text-foreground transition-colors px-2 py-1 appearance-none"
            >
              <option value="fr">🇫🇷 FR</option>
              <option value="ht">🇭🇹 HT</option>
            </select>

          </div>

          {/* Auth Actions */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/superadmin" className="flex items-center gap-2 text-sm font-bold bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md shadow-primary/20">
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center justify-center p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 text-sm font-bold bg-secondary text-foreground px-5 py-2.5 rounded-xl hover:bg-secondary/80 transition-all border border-border/50">
              <LogIn size={18} />
              <span className="hidden sm:inline">{t("saas.navLogin")}</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
