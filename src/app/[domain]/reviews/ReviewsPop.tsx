import { Star, MessageSquare, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Service, SalonSettings } from "@/store/salon";
import { useReviews } from "./useReviews";

export function ReviewsPop({
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
    <div className="flex-1 w-full bg-[#FAFAFA] text-black font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white">
      

      {/* Header */}
      <section className="w-full py-20 px-6 border-b-4 border-black bg-[#FFE5E5]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="text-center md:text-left flex-1">
            <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase inline-block bg-white border-4 border-black px-6 py-2 shadow-[6px_6px_0_0_rgba(0,0,0,1)] -rotate-2">
              Avis Clients
            </h1>
            <p className="text-black font-bold uppercase text-xl mt-4 border-2 border-black bg-white px-4 py-2 rounded-lg shadow-[2px_2px_0_0_rgba(0,0,0,1)] rotate-1 inline-block">
              Ce que l'on dit de nous
            </p>
          </div>
          
          <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col items-center min-w-[250px] rotate-2">
            <div className="text-6xl font-black mb-2">{averageRating}</div>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={28} strokeWidth={3} className={star <= Math.round(Number(averageRating)) ? "fill-primary text-black drop-shadow-[2px_2px_0_rgba(0,0,0,1)]" : "text-black/20"} />
              ))}
            </div>
            <p className="text-lg font-black uppercase text-black bg-[#E5FBE5] border-2 border-black px-3 py-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] -rotate-1">{totalReviews} avis</p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-6 py-12 w-full overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-3 font-black text-sm uppercase transition-all duration-300 border-4 border-black rounded-xl ${activeFilter === "all" ? "bg-black text-white shadow-[4px_4px_0_0_rgba(255,138,91,1)] -translate-y-1" : "bg-white text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]"}`}
          >
            Tous
          </button>
          {[5, 4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => setActiveFilter(rating)}
              className={`px-4 py-3 font-black text-sm uppercase flex items-center gap-2 transition-all duration-300 border-4 border-black rounded-xl ${activeFilter === rating ? "bg-black text-white shadow-[4px_4px_0_0_rgba(255,138,91,1)] -translate-y-1" : "bg-white text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]"}`}
            >
              {rating} <Star size={16} strokeWidth={3} className={activeFilter === rating ? "fill-white text-white" : "fill-primary text-black drop-shadow-[2px_2px_0_rgba(0,0,0,1)]"} />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="max-w-7xl mx-auto px-6 pb-24 w-full">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-24 text-black/50 font-black uppercase">
            <MessageSquare size={64} strokeWidth={2} className="mx-auto mb-6 opacity-30" />
            <p className="text-2xl">Aucun avis trouvé</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {filteredReviews.map((review, i) => (
              <div key={i} className="break-inside-avoid mb-8 bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0_0_rgba(0,0,0,1)] flex flex-col hover:-translate-y-2 hover:shadow-[10px_10px_0_0_rgba(0,0,0,1)] transition-all relative">
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1.5 bg-[#F0F0F0] border-2 border-black p-2 rounded-lg shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={16} strokeWidth={3} className={star <= (review.rating || 5) ? "fill-primary text-black" : "text-black/10"} />
                    ))}
                  </div>
                  <span className="text-xs font-bold border-b-2 border-black pb-1">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-black font-bold text-lg flex-1 mb-6 leading-relaxed">
                  "{review.comment || "Génial !"}"
                </p>

                {review.media && review.media.length > 0 && (
                  <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                    {review.media.map((m: any, idx: number) => (
                      <div key={idx} className="w-20 h-20 shrink-0 border-4 border-black rounded-lg relative bg-[#E5E5FB]">
                        {m.type === 'video' ? (
                          <video src={m.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={m.url} alt="Review media" className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t-4 border-black border-dashed mt-auto">
                  <div className="w-12 h-12 rounded-full bg-[#FFE5E5] border-2 border-black text-black flex items-center justify-center font-black text-lg shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    {(review.is_anonymous ? "A" : (review.client_name?.[0] || "U")).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black uppercase">{review.is_anonymous ? "Anonyme" : review.client_name}</p>
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
