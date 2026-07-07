import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { Service, SalonSettings } from "@/store/salon";

export function useReviews({
  reviews,
  settings,
  services
}: {
  reviews: any[];
  settings: SalonSettings;
  services: Service[];
}) {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState<number | "all">("all");
  const [selectedReview, setSelectedReview] = useState<any | null>(null);

  // Filter reviews by rating
  const filteredReviews = activeFilter === "all" 
    ? reviews 
    : reviews.filter(r => Math.floor(r.rating || 5) === activeFilter);

  // Calculate stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : "0.0";
    
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => Math.floor(r.rating || 5) === rating).length,
    percentage: totalReviews > 0 ? (reviews.filter(r => Math.floor(r.rating || 5) === rating).length / totalReviews) * 100 : 0
  }));

  const getServiceName = (aptId: string) => {
    // In a real app we'd map appointment_id to service_id then to service name.
    // Since we don't have full appointment data here, we might just show "Service" unless it's in the review object.
    return "Service";
  };

  return {
    t,
    activeFilter,
    setActiveFilter,
    selectedReview,
    setSelectedReview,
    filteredReviews,
    totalReviews,
    averageRating,
    ratingCounts,
    getServiceName
  };
}
