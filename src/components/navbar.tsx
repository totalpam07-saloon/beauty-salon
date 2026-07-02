"use client";

import { useI18n } from "./i18n-provider";
import { SalonSettings } from "@/store/salon";
import { Globe, Bell, User as UserIcon, ChevronDown, UserCircle, LogOut, LayoutDashboard, Calendar, AlertTriangle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface NavbarProps {
  settings?: SalonSettings | null;
  pendingAppointmentsCount?: number;
  planExpiresAt?: string | null;
}

export function Navbar({ settings, pendingAppointmentsCount = 0, planExpiresAt }: NavbarProps) {
  const { language, setLanguage, t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate notifications
  const notifications = [];
  
  // 1. Pending Appointments
  if (pendingAppointmentsCount > 0) {
    notifications.push({
      id: "pending_appointments",
      title: "Rendez-vous en attente",
      message: `Vous avez ${pendingAppointmentsCount} rendez-vous en attente de confirmation.`,
      icon: <Calendar size={18} className="text-primary" />,
      link: "/admin/agenda",
      color: "bg-primary/10",
    });
  }

  // 2. Subscription Warning
  if (planExpiresAt) {
    const daysLeft = Math.ceil((new Date(planExpiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    if (daysLeft <= 3 && daysLeft > 0) {
      notifications.push({
        id: "sub_warning",
        title: "Abonnement expire bientôt",
        message: `Votre abonnement expire dans ${daysLeft} jour(s).`,
        icon: <AlertTriangle size={18} className="text-yellow-600" />,
        link: "/admin/settings",
        color: "bg-yellow-500/10",
      });
    } else if (daysLeft <= 0) {
      notifications.push({
        id: "sub_expired",
        title: "Abonnement expiré",
        message: `Veuillez renouveler votre abonnement immédiatement.`,
        icon: <AlertTriangle size={18} className="text-red-600" />,
        link: "/admin/settings",
        color: "bg-red-500/10",
      });
    }
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav className="w-full flex items-center justify-between p-4 bg-card border-b border-border shadow-sm">
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        {(settings?.headerDisplay === "logo" || settings?.headerDisplay === "both" || !settings?.headerDisplay) && settings?.logoUrl ? (
          <div className="relative h-10 sm:h-12 w-32">
            <Image src={settings.logoUrl} alt={settings.salonName || "Logo"} fill sizes="128px" className="object-contain object-left" />
          </div>
        ) : null}
        {(settings?.headerDisplay === "name" || settings?.headerDisplay === "both" || !settings?.headerDisplay) && (
          <span className="font-bold text-xl sm:text-2xl text-primary tracking-tight line-clamp-1">
            {settings?.salonName || "KouLakay Salon"}
          </span>
        )}
      </Link>

      {/* Center Nav Links */}
      <div className="hidden md:flex items-center gap-1">
        <Link href="/" className="px-4 py-2 rounded-xl font-semibold text-sm text-foreground/70 hover:text-primary hover:bg-secondary transition-all">
          {t("nav.home")}
        </Link>
        <Link href="/portfolio" className="px-4 py-2 rounded-xl font-semibold text-sm text-foreground/70 hover:text-primary hover:bg-secondary transition-all">
          {t("nav.portfolio")}
        </Link>
        <Link href="/book" className="px-4 py-2 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity rounded-full">
          {t("nav.book")}
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        {mounted && (
          <div className="flex items-center gap-1">
            <Globe size={16} className="text-foreground/70" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "fr" | "ht")}
              className="bg-transparent border-none text-sm font-medium outline-none cursor-pointer text-foreground"
            >
              <option value="fr">Français</option>
              <option value="ht">Kreyòl</option>
            </select>
          </div>
        )}

        {/* User Profile & Notifications (Only if logged in) */}
        {mounted && user && (
          <div className="flex items-center gap-4 border-l border-border pl-4 ml-2">
            {/* Notification Bell */}
            <div className="relative z-50" ref={notificationsRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`relative p-2 rounded-full transition-all active:scale-95 border ${isNotificationsOpen ? 'bg-secondary border-border' : 'hover:bg-secondary/80 border-transparent hover:border-border'}`}
              >
                <Bell size={20} className="text-foreground/70" strokeWidth={2.5} />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 origin-top-right">
                  <div className="px-4 py-2 border-b border-border flex justify-between items-center">
                    <span className="font-extrabold text-sm text-foreground">Notifications</span>
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                      {notifications.length}
                    </span>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-foreground/50 text-sm font-medium">
                        Aucune nouvelle notification
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <Link 
                          key={notif.id} 
                          href={notif.link}
                          onClick={() => setIsNotificationsOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary transition-colors"
                        >
                          <div className={`p-2 rounded-full mt-0.5 ${notif.color}`}>
                            {notif.icon}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground">{notif.title}</p>
                            <p className="text-xs text-foreground/70 mt-0.5 leading-relaxed">{notif.message}</p>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative z-50" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-secondary/50 border border-transparent hover:border-border transition-all"
              >
                <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
                  {user.user_metadata?.avatar_url ? (
                    <Image src={user.user_metadata.avatar_url} alt="Profile" fill sizes="32px" className="object-cover" />
                  ) : (
                    <UserIcon size={16} className="text-primary" strokeWidth={2.5} />
                  )}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-xs font-extrabold text-foreground leading-tight">
                    {user.user_metadata?.name || user.email?.split('@')[0] || "Admin"}
                  </span>
                  <span className="text-[10px] font-bold text-foreground/40 leading-tight">
                    Gérant
                  </span>
                </div>
                <ChevronDown size={14} className={`text-foreground/50 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-lg shadow-black/5 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-border bg-secondary/20">
                    <p className="text-sm font-extrabold text-foreground truncate">
                      {user.user_metadata?.name || user.email?.split('@')[0] || "Admin"}
                    </p>
                    <p className="text-xs text-foreground/60 truncate">{user.email}</p>
                  </div>
                  
                  <div className="p-2">
                    <Link href="/admin/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-secondary text-sm font-bold text-foreground/80 transition-colors">
                      <UserCircle size={18} />
                      Mon Profil
                    </Link>
                    <Link href="/admin" onClick={() => setIsProfileOpen(false)} className="flex md:hidden items-center gap-3 w-full p-3 rounded-xl hover:bg-secondary text-sm font-bold text-foreground/80 transition-colors">
                      <LayoutDashboard size={18} />
                      Tableau de Bord
                    </Link>
                  </div>

                  <div className="p-2 border-t border-border">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-500/10 text-sm font-bold text-red-500 transition-colors"
                    >
                      <LogOut size={18} />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
