import { useState } from "react";
import { Service, SalonSettings, PortfolioPhoto } from "@/store/salon";
import { useI18n } from "@/components/i18n-provider";

export function usePortfolio({
  services,
  settings,
  portfolio
}: {
  services: Service[];
  settings: SalonSettings;
  portfolio: PortfolioPhoto[];
}) {
  const { t, language } = useI18n();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);

  // Build unique category list
  const categories = ["all", ...Array.from(new Set(portfolio.map((p) => p.category).filter(Boolean)))];

  const filtered = activeFilter === "all" ? portfolio : portfolio.filter((p) => p.category === activeFilter);

  const selectedPhoto = portfolio.find((p) => p.id === selected);
  const relatedService = selectedPhoto ? services.find((s) => s.name.toLowerCase().includes(selectedPhoto.category.toLowerCase())) : null;

  return {
    t,
    language,
    activeFilter,
    setActiveFilter,
    selected,
    setSelected,
    categories,
    filtered,
    selectedPhoto,
    relatedService
  };
}
