import { Star, MessageSquare, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Service, SalonSettings } from "@/store/salon";
import { useReviews } from "./useReviews";

export function ReviewsEditorial({
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
    <div className="flex-1 w-full bg-white text-black font-sans min-h-screen flex flex-col selection:bg-black selection:text-white border-x border-black/10 max-w-[1400px] mx-auto">
      

      {/* Header */}
      <section className="w-full py-24 px-6 border-b border-black">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="text-center md:text-left flex-1">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-black/40 mb-4 block">Témoignages</span>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-tighter uppercase">Avis.</h1>
            <div className="w-12 h-px bg-black mb-6 mx-auto md:mx-0"></div>
            <p className="text-black/60 text-xs font-sans uppercase tracking-[0.2em] leading-relaxed">
              Ce que l'on dit de nous
            </p>
          </div>
          
          <div className="border border-black p-12 min-w-[280px] flex flex-col items-center">
            <div className="text-6xl font-serif mb-4">{averageRating}</div>
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={20} strokeWidth={1} className={star <= Math.round(Number(averageRating)) ? "fill-black text-black" : "text-black/20"} />
              ))}
            </div>
            <p className="text-[10px] font-sans uppercase tracking-[0.3em]">{totalReviews} AVIS</p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <div className="max-w-6xl mx-auto px-6 py-12 w-full overflow-x-auto border-b border-black/10">
        <div className="flex gap-6 min-w-max pb-4">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-2 text-[10px] font-sans uppercase tracking-[0.3em] transition-all border ${activeFilter === "all" ? "border-black bg-black text-white" : "border-black/20 text-black/50 hover:border-black hover:text-black"}`}
          >
            Tous les avis
          </button>
          {[5, 4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => setActiveFilter(rating)}
              className={`px-4 py-2 text-[10px] font-sans uppercase tracking-[0.3em] flex items-center gap-2 transition-all border ${activeFilter === rating ? "border-black bg-black text-white" : "border-black/20 text-black/50 hover:border-black hover:text-black"}`}
            >
              {rating} <Star size={12} strokeWidth={1} className={activeFilter === rating ? "fill-white text-white" : "fill-black text-black"} />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="max-w-6xl mx-auto px-6 pb-32 pt-16 w-full">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-32 text-black/20">
            <MessageSquare size={48} strokeWidth={1} className="mx-auto mb-6 opacity-50" />
            <p className="text-[10px] font-sans uppercase tracking-[0.3em]">Aucun avis trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {filteredReviews.map((review, i) => (
              <div key={i} className="group border border-black/10 p-10 flex flex-col h-full hover:border-black transition-colors bg-zinc-50/50">
                
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-black/10">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={14} strokeWidth={1} className={star <= (review.rating || 5) ? "fill-black text-black" : "text-black/10"} />
                    ))}
                  </div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-black/40">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-black/80 font-serif text-xl flex-1 mb-10 leading-loose italic">
                  "{review.comment || "Magnifique."}"
                </p>

                {review.media && review.media.length > 0 && (
                  <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
                    {review.media.map((m: any, idx: number) => (
                      <div key={idx} className="w-24 h-24 shrink-0 border border-black bg-zinc-100 overflow-hidden group/media">
                        {m.type === 'video' ? (
                          <video src={m.url} className="w-full h-full object-cover grayscale opacity-70 group-hover/media:grayscale-0 group-hover/media:opacity-100 transition-all duration-700" />
                        ) : (
                          <img src={m.url} alt="Review media" className="w-full h-full object-cover grayscale opacity-70 group-hover/media:grayscale-0 group-hover/media:opacity-100 transition-all duration-700" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-6">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-serif text-xs">
                    {(review.is_anonymous ? "A" : (review.client_name?.[0] || "U")).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em]">{review.is_anonymous ? "Anonyme" : review.client_name}</p>
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
