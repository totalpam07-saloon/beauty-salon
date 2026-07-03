"use client";

import { MapPin } from "lucide-react";
import { SalonSettings } from "@/store/salon";
import { useI18n } from "./i18n-provider";
import { usePathname } from "next/navigation";

export function Footer({ settings }: { settings?: SalonSettings | null }) {
  const { t } = useI18n();
  const pathname = usePathname();

  if (!settings) return null;

  const currentYear = new Date().getFullYear();
  const isAdmin = pathname?.startsWith("/admin");

  // Custom SVG Components for Brands
  const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );

  const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.25-1.07 4.52-2.91 5.85-1.57 1.15-3.66 1.48-5.54 1.09-2.06-.41-3.95-1.84-4.81-3.79-.88-2.02-.91-4.46-.02-6.52.84-1.94 2.58-3.45 4.63-4.04 1.58-.46 3.29-.38 4.79.2.03-1.41.01-2.82.02-4.23-1.04-.3-2.12-.39-3.19-.24-1.82.25-3.56 1.25-4.71 2.67-1.16 1.43-1.66 3.32-1.39 5.15.28 1.87 1.41 3.6 2.92 4.6 1.57 1.05 3.59 1.3 5.42.79 1.62-.44 3.03-1.62 3.82-3.13.56-1.07.82-2.3.8-3.51-.04-4.14-.02-8.28-.02-12.43z"/>
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );

  // Social Links map
  const socialLinks = [
    { url: settings.instagramUrl, icon: InstagramIcon, label: "Instagram", colorClass: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white" },
    { url: settings.facebookUrl, icon: FacebookIcon, label: "Facebook", colorClass: "hover:bg-[#1877F2] hover:text-white" },
    { url: settings.tiktokUrl, icon: TikTokIcon, label: "TikTok", colorClass: "hover:bg-black hover:text-white" },
    { url: settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}` : null, icon: WhatsAppIcon, label: "WhatsApp", colorClass: "hover:bg-[#25D366] hover:text-white" },
  ].filter(link => link.url); // only keep links that exist

  return (
    <footer className={`w-full bg-card border-t border-border mt-auto ${isAdmin ? "pb-24 md:pb-8" : ""}`}>
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-extrabold text-xl text-primary mb-2">
              {settings.salonName || "KouLakay Salon"}
            </h3>
            {settings.address && (
              <p className="text-sm font-medium text-foreground/70 flex items-center gap-2 mb-2 max-w-xs md:max-w-sm">
                <MapPin size={16} className="shrink-0 text-primary" /> {settings.address}
              </p>
            )}
            <p className="text-sm font-medium text-foreground/50">
              © {currentYear} {settings.salonName}. Tous droits réservés.
            </p>
            <a 
              href="https://crochetri.store" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 text-xs font-bold text-foreground/40 hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Propulsé par Crochetri
            </a>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground/70 transition-all duration-300 ${social.colorClass}`}
                    title={social.label}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          )}
          
        </div>
      </div>
    </footer>
  );
}
