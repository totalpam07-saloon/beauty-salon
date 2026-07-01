"use client";

import { useI18n } from "@/components/i18n-provider";
import { useSalonStore } from "@/store/salon";
import { Calendar, ChevronRight, Sparkles, Scissors, Smile } from "lucide-react";
import Link from "next/link";

const icons = [
  <Scissors className="w-6 h-6 text-primary" key="scissors" />,
  <Sparkles className="w-6 h-6 text-primary" key="sparkles" />,
  <Smile className="w-6 h-6 text-primary" key="smile" />,
];

export default function Home() {
  const { t } = useI18n();
  const { services } = useSalonStore();

  return (
    <div className="flex-1 w-full bg-background transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative w-full h-[450px] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/20 rounded-full blur-[80px] -z-10" />

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4 drop-shadow-sm">
          {t("home.title")}
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-lg mb-8">
          {t("home.subtitle")}
        </p>
        <Link href="/book" className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300">
          <Calendar size={20} />
          {t("home.bookNow")}
        </Link>
      </section>

      {/* Services Section */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <h2 className="text-3xl font-extrabold text-foreground mb-8 flex items-center gap-3">
          <Sparkles className="text-primary w-8 h-8" />
          {t("home.services")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <Link
              key={service.id}
              href={`/book?service=${service.id}`}
              className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                  <div className="group-hover:text-primary-foreground transition-colors duration-300">
                    {icons[i % icons.length]}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{service.name}</h3>
                <p className="text-foreground/60 font-medium text-sm">{service.duration}</p>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-black text-primary">${service.priceUSD}</span>
                  <span className="text-sm font-bold text-foreground/50">{service.priceHTG.toLocaleString()} HTG</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                  <ChevronRight size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
