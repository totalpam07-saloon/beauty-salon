"use client";

import { Camera, Globe, Play, MessageCircle, MapPin } from "lucide-react";
import { SalonSettings } from "@/store/salon";
import { useI18n } from "./i18n-provider";

export function Footer({ settings }: { settings?: SalonSettings | null }) {
  const { t } = useI18n();

  if (!settings) return null;

  const currentYear = new Date().getFullYear();

  // Social Links map
  const socialLinks = [
    { url: settings.instagramUrl, icon: Camera, label: "Instagram" },
    { url: settings.facebookUrl, icon: Globe, label: "Facebook" },
    { url: settings.tiktokUrl, icon: Play, label: "TikTok" },
    { url: settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}` : null, icon: MessageCircle, label: "WhatsApp" },
  ].filter(link => link.url); // only keep links that exist

  return (
    <footer className="w-full bg-card border-t border-border mt-auto">
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
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    title={social.label}
                  >
                    <Icon size={20} strokeWidth={2.5} />
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
