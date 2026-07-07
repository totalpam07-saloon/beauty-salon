"use client";

import { Service, SalonSettings, PortfolioPhoto } from "@/store/salon";
import { usePortfolio } from "./usePortfolio";
import { PortfolioClassic } from "./PortfolioClassic";
import { PortfolioLuxe } from "./PortfolioLuxe";
import { PortfolioSpa } from "./PortfolioSpa";
import { PortfolioPop } from "./PortfolioPop";
import { PortfolioEditorial } from "./PortfolioEditorial";
import { PortfolioPlayful } from "./PortfolioPlayful";
import { PortfolioRetro } from "./PortfolioRetro";

interface ClientPortfolioProps {
  services: Service[];
  settings: SalonSettings;
  portfolio: PortfolioPhoto[];
}

export default function ClientPortfolio({ services, settings, portfolio }: ClientPortfolioProps) {
  const flow = usePortfolio({ services, settings, portfolio });

  const props = {
    services,
    settings,
    portfolio,
    flow
  };

  switch (settings?.theme) {
    case "classic":
      return <PortfolioClassic {...props} />;
    case "luxe":
      return <PortfolioLuxe {...props} />;
    case "spa":
      return <PortfolioSpa {...props} />;
    case "pop":
      return <PortfolioPop {...props} />;
    case "editorial":
      return <PortfolioEditorial {...props} />;
    case "playful":
      return <PortfolioPlayful {...props} />;
    case "retro":
      return <PortfolioRetro {...props} />;
    default:
      return <PortfolioClassic {...props} />;
  }
}
