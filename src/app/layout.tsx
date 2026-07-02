import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/components/i18n-provider";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Salon de Beauté",
  description: "Réservez votre rendez-vous de beauté.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="earthy"
          themes={["soft", "dark", "earthy"]}
        >
          <I18nProvider>
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
