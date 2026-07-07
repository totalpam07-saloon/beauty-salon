import { Star, MessageSquare, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Service, SalonSettings } from "@/store/salon";
import { useReviews } from "./useReviews";

export function ReviewsPlayful({
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
    <div className="flex-1 w-full bg-[#F0F5FF] text-slate-800 font-sans min-h-screen flex flex-col selection:bg-purple-300 selection:text-slate-900 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 animate-[blob_7s_infinite]"></div>
      <div className="fixed top-40 left-0 w-72 h-72 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 animate-[blob_7s_infinite_2s]"></div>
      <div className="fixed -bottom-8 left-20 w-72 h-72 bg-yellow-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 animate-[blob_7s_infinite_4s]"></div>

      

      {/* Header */}
      <section className="w-full py-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 bg-white/40 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[3rem] shadow-xl">
          <div className="text-center md:text-left flex-1">
            <span className="bg-white/60 text-primary font-bold px-4 py-1.5 rounded-full text-xs shadow-sm mb-4 inline-block uppercase tracking-wider">Témoignages</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">Avis Clients</h1>
            <p className="text-slate-600 font-bold bg-white/50 px-6 py-2 rounded-xl inline-block shadow-sm">
              Découvrez ce qu'ils pensent de nous
            </p>
          </div>
          
          <div className="bg-white/70 border border-white p-8 rounded-[2rem] shadow-lg flex flex-col items-center min-w-[200px] hover:scale-105 transition-transform">
            <div className="text-6xl font-extrabold mb-2 text-slate-800">{averageRating}</div>
            <div className="flex gap-1.5 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={24} strokeWidth={2.5} className={star <= Math.round(Number(averageRating)) ? "fill-yellow-400 text-yellow-400 drop-shadow-sm" : "text-slate-300"} />
              ))}
            </div>
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">{totalReviews} avis</p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <div className="max-w-6xl mx-auto px-6 py-8 w-full overflow-x-auto relative z-10">
        <div className="flex gap-3 min-w-max pb-4">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-3 rounded-[1.5rem] font-extrabold text-sm transition-all duration-300 shadow-sm border border-white ${activeFilter === "all" ? "bg-gradient-to-r from-primary to-purple-500 text-white shadow-md scale-105" : "bg-white/60 text-slate-600 hover:bg-white hover:shadow-md"}`}
          >
            Tous
          </button>
          {[5, 4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => setActiveFilter(rating)}
              className={`px-5 py-3 rounded-[1.5rem] font-extrabold text-sm flex items-center gap-2 transition-all duration-300 shadow-sm border border-white ${activeFilter === rating ? "bg-gradient-to-r from-primary to-purple-500 text-white shadow-md scale-105" : "bg-white/60 text-slate-600 hover:bg-white hover:shadow-md"}`}
            >
              {rating} <Star size={16} strokeWidth={2.5} className={activeFilter === rating ? "fill-yellow-300 text-yellow-300 drop-shadow-sm" : "fill-yellow-400 text-yellow-400"} />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="max-w-6xl mx-auto px-6 pb-32 w-full relative z-10">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-[3rem] border border-white shadow-xl">
            <MessageSquare size={64} strokeWidth={2} className="mx-auto mb-6 text-slate-300" />
            <p className="font-extrabold text-xl text-slate-500">Aucun avis trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-lg border border-white p-6 rounded-[2rem] shadow-lg flex flex-col h-full hover:-translate-y-2 hover:shadow-xl hover:bg-white/80 transition-all duration-300 group">
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1 bg-white/50 px-3 py-1.5 rounded-full shadow-inner border border-white">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={14} strokeWidth={2.5} className={star <= (review.rating || 5) ? "fill-yellow-400 text-yellow-400 drop-shadow-sm" : "text-slate-300"} />
                    ))}
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-white/50 px-2 py-1 rounded-lg">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-slate-700 font-bold flex-1 mb-6 leading-relaxed group-hover:text-slate-900 transition-colors">
                  "{review.comment || "Super expérience !"}"
                </p>

                {review.media && review.media.length > 0 && (
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {review.media.map((m: any, idx: number) => (
                      <div key={idx} className="w-16 h-16 rounded-[1rem] overflow-hidden shrink-0 border-2 border-white shadow-sm relative group/media">
                        {m.type === 'video' ? (
                          <video src={m.url} className="w-full h-full object-cover group-hover/media:scale-110 transition-transform duration-500" />
                        ) : (
                          <img src={m.url} alt="Review media" className="w-full h-full object-cover group-hover/media:scale-110 transition-transform duration-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4 border-t-2 border-white border-dashed">
                  <div className="w-10 h-10 rounded-[1rem] bg-gradient-to-br from-primary to-purple-400 text-white flex items-center justify-center font-extrabold shadow-md -rotate-3 group-hover:rotate-0 transition-transform">
                    {(review.is_anonymous ? "A" : (review.client_name?.[0] || "U")).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-slate-700">{review.is_anonymous ? "Anonyme" : review.client_name}</p>
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
