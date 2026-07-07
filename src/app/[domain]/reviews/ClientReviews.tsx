"use client";

import { useReviews } from "./useReviews";
import { ReviewsClassic } from "./ReviewsClassic";
import { ReviewsLuxe } from "./ReviewsLuxe";
import { ReviewsSpa } from "./ReviewsSpa";
import { ReviewsPop } from "./ReviewsPop";
import { ReviewsEditorial } from "./ReviewsEditorial";
import { ReviewsPlayful } from "./ReviewsPlayful";
import { ReviewsRetro } from "./ReviewsRetro";
import { SalonSettings, Service } from "@/store/salon";

interface ClientReviewsProps {
  reviews: any[];
  settings: SalonSettings;
  services: Service[];
}

export default function ClientReviews({ reviews, settings, services }: ClientReviewsProps) {
  const flow = useReviews({ reviews, settings, services });

  const props = {
    reviews,
    settings,
    services,
    flow
  };

  switch (settings?.theme) {
    case "classic":
      return <ReviewsClassic {...props} />;
    case "luxe":
      return <ReviewsLuxe {...props} />;
    case "spa":
      return <ReviewsSpa {...props} />;
    case "pop":
      return <ReviewsPop {...props} />;
    case "editorial":
      return <ReviewsEditorial {...props} />;
    case "playful":
      return <ReviewsPlayful {...props} />;
    case "retro":
      return <ReviewsRetro {...props} />;
    default:
      return <ReviewsClassic {...props} />;
  }
}
