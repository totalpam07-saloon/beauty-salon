"use client";

import { useTheme } from "next-themes";
import { useI18n } from "./i18n-provider";
import { Palette, Globe } from "lucide-react";
import { useEffect, useState } from "react";

import Link from "next/link";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="w-full flex items-center justify-between p-4 bg-card border-b border-border shadow-sm">
      <Link href="/" className="font-bold text-xl text-primary tracking-tight hover:opacity-80 transition-opacity">
        KouLakay Salon
      </Link>

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

        {/* Theme Switcher */}
        {mounted && (
          <div className="flex items-center gap-1 border-l border-border pl-4">
            <Palette size={16} className="text-foreground/70" />
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-transparent border-none text-sm font-medium outline-none cursor-pointer text-foreground"
            >
              <option value="soft">Soft</option>
              <option value="dark">Dark</option>
              <option value="earthy">Earthy</option>
            </select>
          </div>
        )}
      </div>
    </nav>
  );
}
