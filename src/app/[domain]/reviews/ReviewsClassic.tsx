import { Star, MessageSquare, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Service, SalonSettings } from "@/store/salon";
import { useReviews } from "./useReviews";

export function ReviewsClassic({
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
    <div className="flex-1 w-full bg-background min-h-screen text-foreground flex flex-col">
      

      {/* Header */}
      <section className="w-full py-16 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Avis de nos clients</h1>
            <p className="text-foreground/60 text-lg">Découvrez ce que nos clients pensent de nos services.</p>
          </div>
          
          <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm flex flex-col items-center min-w-[250px]">
            <div className="text-5xl font-black mb-2">{averageRating}</div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={20} className={star <= Math.round(Number(averageRating)) ? "fill-yellow-400 text-yellow-400" : "text-foreground/20"} />
              ))}
            </div>
            <p className="text-sm font-medium text-foreground/60">{totalReviews} avis au total</p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <div className="max-w-6xl mx-auto px-4 py-8 w-full overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${activeFilter === "all" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground/70 hover:border-foreground/30"}`}
          >
            Tous les avis
          </button>
          {[5, 4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => setActiveFilter(rating)}
              className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors ${activeFilter === rating ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground/70 hover:border-foreground/30"}`}
            >
              {rating} <Star size={14} className={activeFilter === rating ? "fill-current" : "fill-yellow-400 text-yellow-400"} />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="max-w-6xl mx-auto px-4 pb-24 w-full">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-20 text-foreground/40">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-bold text-lg">Aucun avis trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review, i) => (
              <div key={i} className="bg-card border border-border p-6 rounded-3xl shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={16} className={star <= (review.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-foreground/20"} />
                    ))}
                  </div>
                  <span className="text-xs text-foreground/50 font-medium">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-foreground/80 font-medium flex-1 mb-6 leading-relaxed">
                  "{review.comment || "Super service !"}"
                </p>

                {review.media && review.media.length > 0 && (
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {review.media.map((m: any, idx: number) => (
                      <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border relative">
                        {m.type === 'video' ? (
                          <video src={m.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={m.url} alt="Review media" className="w-full h-full object-cover" />
                        )}
                        {m.type === 'video' && <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white"><ImageIcon size={16} /></div>}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {(review.is_anonymous ? "A" : (review.client_name?.[0] || "U")).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{review.is_anonymous ? "Anonyme" : review.client_name}</p>
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
