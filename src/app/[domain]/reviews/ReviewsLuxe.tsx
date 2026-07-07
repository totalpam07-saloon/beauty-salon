import { Star, MessageSquare, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Service, SalonSettings } from "@/store/salon";
import { useReviews } from "./useReviews";

export function ReviewsLuxe({
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
    <div className="flex-1 w-full bg-[#1A1A1A] text-white font-sans min-h-screen flex flex-col selection:bg-[#D4AF37] selection:text-[#1A1A1A]">
      

      {/* Header */}
      <section className="w-full py-20 px-6 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-6 tracking-widest uppercase">Avis Clients</h1>
            <div className="w-16 h-px bg-white/20 mb-6 mx-auto md:mx-0"></div>
            <p className="text-white/60 text-sm font-light uppercase tracking-widest leading-relaxed">
              Découvrez l'expérience de nos clients
            </p>
          </div>
          
          <div className="bg-[#141414] border border-white/10 p-10 flex flex-col items-center min-w-[280px]">
            <div className="text-6xl font-serif text-[#D4AF37] mb-4">{averageRating}</div>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={20} strokeWidth={1} className={star <= Math.round(Number(averageRating)) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white/20"} />
              ))}
            </div>
            <p className="text-xs font-light tracking-widest uppercase text-white/50">{totalReviews} avis</p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <div className="max-w-6xl mx-auto px-6 py-12 w-full overflow-x-auto">
        <div className="flex gap-4 min-w-max border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 text-xs font-light uppercase tracking-[0.2em] transition-colors relative ${activeFilter === "all" ? "text-[#D4AF37]" : "text-white/40 hover:text-white"}`}
          >
            Tous
            {activeFilter === "all" && <div className="absolute bottom-[-17px] left-0 right-0 h-px bg-[#D4AF37]" />}
          </button>
          {[5, 4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => setActiveFilter(rating)}
              className={`px-4 py-2 text-xs font-light flex items-center gap-2 transition-colors relative ${activeFilter === rating ? "text-[#D4AF37]" : "text-white/40 hover:text-white"}`}
            >
              {rating} <Star size={12} strokeWidth={1} className={activeFilter === rating ? "fill-current" : "text-[#D4AF37]"} />
              {activeFilter === rating && <div className="absolute bottom-[-17px] left-0 right-0 h-px bg-[#D4AF37]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="max-w-6xl mx-auto px-6 pb-32 w-full">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-32 text-white/20">
            <MessageSquare size={48} strokeWidth={1} className="mx-auto mb-6 opacity-30" />
            <p className="tracking-widest uppercase text-sm font-light">Aucun avis trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredReviews.map((review, i) => (
              <div key={i} className="bg-[#141414] border border-white/5 p-8 flex flex-col h-full hover:border-white/20 transition-colors relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={14} strokeWidth={1} className={star <= (review.rating || 5) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white/10"} />
                    ))}
                  </div>
                  <span className="text-[10px] text-white/30 font-light tracking-widest uppercase">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-white/70 font-serif text-lg flex-1 mb-8 leading-relaxed italic">
                  "{review.comment || "Une expérience exceptionnelle."}"
                </p>

                {review.media && review.media.length > 0 && (
                  <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                    {review.media.map((m: any, idx: number) => (
                      <div key={idx} className="w-20 h-20 shrink-0 border border-white/10 relative group">
                        {m.type === 'video' ? (
                          <video src={m.url} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                        ) : (
                          <img src={m.url} alt="Review media" className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-serif text-sm">
                    {(review.is_anonymous ? "A" : (review.client_name?.[0] || "U")).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-light text-sm uppercase tracking-widest text-white/90">{review.is_anonymous ? "Anonyme" : review.client_name}</p>
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
