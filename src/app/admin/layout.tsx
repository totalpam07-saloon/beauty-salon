"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Scissors, Settings, LogOut } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();

  if (pathname === "/admin/login") return <>{children}</>;

  const navItems = [
    { href: "/admin", label: t("admin.navDashboard"), icon: LayoutDashboard },
    { href: "/admin/services", label: t("admin.navServices"), icon: Scissors },
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
        <div className="mt-auto">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-foreground/50 hover:bg-secondary transition-all">
            <LogOut size={20} /> {t("admin.navBack")}
          </Link>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around p-2">
        {navItems.map(({ href, label, icon: Icon }) => (
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

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">{children}</main>
    </div>
  );
}
