"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Scissors, Settings, Images, Calendar, Users, Contact } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { AdminBanner } from "@/components/AdminBanner";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();

  if (pathname === "/admin/login") return <>{children}</>;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const navItems = [
    { href: "/admin", label: t("admin.navDashboard"), icon: LayoutDashboard },
    { href: "/admin/agenda", label: "Agenda", icon: Calendar },
    { href: "/admin/clients", label: t("admin.navClients"), icon: Users },
    { href: "/admin/staff", label: t("admin.navStaff"), icon: Contact },
    { href: "/admin/services", label: t("admin.navServices"), icon: Scissors },
    { href: "/admin/portfolio", label: t("admin.navPortfolio"), icon: Images },
    { href: "/admin/settings", label: t("admin.navSettings"), icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-6 gap-2">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1">{t("admin.navAdminPanel")}</p>
          <h2 className="text-xl font-extrabold text-primary">{t("admin.navManager")}</h2>
        </div>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
              pathname === href
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-foreground/70 hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </aside>

      {/* Mobile Top Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around p-2 pb-safe">
        {navItems.filter(item => ["/admin", "/admin/agenda", "/admin/clients", "/admin/staff", "/admin/settings"].includes(item.href)).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              pathname === href ? "text-primary" : "text-foreground/50"
            }`}
          >
            <Icon size={22} />
            {label}
          </Link>
        ))}
      </div>

      {/* Main content area wrapped in flex-col */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminBanner />
        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">{children}</main>
      </div>
    </div>
  );
}
