import { Star, MessageSquare, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Service, SalonSettings } from "@/store/salon";
import { useReviews } from "./useReviews";

export function ReviewsSpa({
  reviews,
  settings,
  services,
  flow
}: {
  reviews: any[];
  settings: SalonSettings;
  services: Service[];
  flow: ReturnType<typeof useReviews>;
}) {
  const {
    t,
    activeFilter,
    setActiveFilter,
    filteredReviews,
    totalReviews,
    averageRating,
    ratingCounts
  } = flow;

  return (
    <div className="flex-1 w-full bg-[#F9F6F0] text-[#5C5447] font-sans min-h-screen flex flex-col">
      

      {/* Header */}
      <section className="w-full py-24 px-6 border-b border-[#E5DFD3] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E5DFD3]/40 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-light text-[#3D372F] mb-6 tracking-wide">Avis Clients</h1>
            <p className="text-[#7A7265] text-lg font-light leading-relaxed">
              Découvrez l'expérience de nos clients
            </p>
          </div>
          
          <div className="bg-white border border-[#E5DFD3] p-12 rounded-[3rem] shadow-sm flex flex-col items-center min-w-[280px]">
            <div className="text-6xl font-light text-[#3D372F] mb-4">{averageRating}</div>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={24} strokeWidth={1.5} className={star <= Math.round(Number(averageRating)) ? "fill-yellow-400 text-yellow-400" : "text-[#E5DFD3]"} />
              ))}
            </div>
            <p className="text-sm font-light text-[#7A7265] uppercase tracking-widest">{totalReviews} avis</p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <div className="max-w-5xl mx-auto px-6 py-12 w-full overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-8 py-3 rounded-full font-light text-sm transition-all duration-300 ${activeFilter === "all" ? "bg-[#3D372F] text-white shadow-md" : "bg-white border border-[#E5DFD3] text-[#7A7265] hover:border-[#3D372F]/30"}`}
          >
            Tous les avis
          </button>
          {[5, 4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => setActiveFilter(rating)}
              className={`px-6 py-3 rounded-full font-light text-sm flex items-center gap-2 transition-all duration-300 ${activeFilter === rating ? "bg-[#3D372F] text-white shadow-md" : "bg-white border border-[#E5DFD3] text-[#7A7265] hover:border-[#3D372F]/30"}`}
            >
              {rating} <Star size={16} strokeWidth={1.5} className={activeFilter === rating ? "fill-white text-white" : "fill-yellow-400 text-yellow-400"} />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="max-w-5xl mx-auto px-6 pb-32 w-full">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-32 text-[#7A7265]/40">
            <MessageSquare size={64} strokeWidth={1} className="mx-auto mb-6 opacity-30" />
            <p className="font-light text-lg">Aucun avis trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredReviews.map((review, i) => (
              <div key={i} className="bg-white border border-[#E5DFD3] p-10 rounded-[2.5rem] shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={16} strokeWidth={1.5} className={star <= (review.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-[#E5DFD3]"} />
                    ))}
                  </div>
                  <span className="text-xs text-[#7A7265] font-light">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-[#5C5447] font-light text-lg flex-1 mb-8 leading-relaxed">
                  "{review.comment || "Une expérience relaxante."}"
                </p>

                {review.media && review.media.length > 0 && (
                  <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                    {review.media.map((m: any, idx: number) => (
                      <div key={idx} className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-[#E5DFD3] relative">
                        {m.type === 'video' ? (
                          <video src={m.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={m.url} alt="Review media" className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-6 border-t border-[#E5DFD3]/50">
                  <div className="w-12 h-12 rounded-full bg-[#F9F6F0] text-[#3D372F] flex items-center justify-center font-medium text-lg">
                    {(review.is_anonymous ? "A" : (review.client_name?.[0] || "U")).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-[#3D372F]">{review.is_anonymous ? "Anonyme" : review.client_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
