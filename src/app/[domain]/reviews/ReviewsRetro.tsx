import { Star, MessageSquare, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Service, SalonSettings } from "@/store/salon";
import { useReviews } from "./useReviews";

export function ReviewsRetro({
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
    <div className="flex-1 w-full bg-[#F4EBD9] text-[#3D405B] font-sans min-h-screen flex flex-col selection:bg-[#E07A5F] selection:text-[#F4EBD9]">
      

      {/* Header */}
      <section className="w-full py-16 px-6 border-b-[4px] border-[#3D405B] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="text-center md:text-left flex-1">
            <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase text-[#E07A5F] drop-shadow-[3px_3px_0_#3D405B] -rotate-1">
              Avis Clients
            </h1>
            <p className="text-[#3D405B] font-bold uppercase tracking-widest mt-2 bg-[#F2CC8F] px-4 py-2 rounded-lg border-[3px] border-[#3D405B] shadow-[2px_2px_0_0_#3D405B] rotate-1 inline-block">
              Ce que l'on dit de nous
            </p>
          </div>
          
          <div className="bg-[#81B29A] border-[4px] border-[#3D405B] p-8 rounded-2xl shadow-[8px_8px_0_0_#3D405B] flex flex-col items-center min-w-[220px] rotate-2">
            <div className="text-6xl font-black mb-2 text-[#F4EBD9] drop-shadow-[2px_2px_0_#3D405B]">{averageRating}</div>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={24} strokeWidth={3} className={star <= Math.round(Number(averageRating)) ? "fill-[#E07A5F] text-[#E07A5F] drop-shadow-[2px_2px_0_#3D405B]" : "text-[#F4EBD9] opacity-50"} />
              ))}
            </div>
            <p className="text-sm font-black uppercase text-[#3D405B] bg-[#F2CC8F] border-[2px] border-[#3D405B] px-3 py-1 shadow-[2px_2px_0_0_#3D405B] -rotate-2">{totalReviews} avis</p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <div className="max-w-6xl mx-auto px-6 py-10 w-full overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-3 font-black text-sm uppercase tracking-widest transition-all duration-200 border-[3px] border-[#3D405B] rounded-xl ${activeFilter === "all" ? "bg-[#E07A5F] text-[#F4EBD9] shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)] translate-y-1" : "bg-[#F4EBD9] text-[#3D405B] shadow-[4px_4px_0_0_#3D405B] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#3D405B]"}`}
          >
            Tous
          </button>
          {[5, 4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => setActiveFilter(rating)}
              className={`px-5 py-3 font-black text-sm uppercase tracking-widest flex items-center gap-2 transition-all duration-200 border-[3px] border-[#3D405B] rounded-xl ${activeFilter === rating ? "bg-[#E07A5F] text-[#F4EBD9] shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)] translate-y-1" : "bg-[#F4EBD9] text-[#3D405B] shadow-[4px_4px_0_0_#3D405B] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#3D405B]"}`}
            >
              {rating} <Star size={16} strokeWidth={3} className={activeFilter === rating ? "fill-[#F4EBD9] text-[#F4EBD9]" : "fill-[#E07A5F] text-[#E07A5F]"} />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="max-w-6xl mx-auto px-6 pb-24 w-full">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-20 bg-white border-[4px] border-[#3D405B] rounded-2xl shadow-[8px_8px_0_0_#3D405B]">
            <MessageSquare size={64} strokeWidth={2} className="mx-auto mb-6 text-[#3D405B]/30" />
            <p className="text-2xl font-black uppercase text-[#3D405B]/60">Aucun avis trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReviews.map((review, i) => (
              <div key={i} className={`bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-white border-[4px] border-[#3D405B] p-6 rounded-2xl shadow-[6px_6px_0_0_#3D405B] flex flex-col hover:-translate-y-2 hover:shadow-[10px_10px_0_0_#3D405B] transition-all relative ${i % 2 === 0 ? 'rotate-1 hover:rotate-2' : '-rotate-1 hover:-rotate-2'}`}>
                
                <div className="flex items-center justify-between mb-6 border-b-[3px] border-[#3D405B] border-dashed pb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={16} strokeWidth={3} className={star <= (review.rating || 5) ? "fill-[#E07A5F] text-[#E07A5F]" : "text-[#3D405B]/20"} />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-[#F2CC8F] border-[2px] border-[#3D405B] px-2 py-1 rounded">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-[#3D405B] font-bold text-lg flex-1 mb-6 leading-relaxed">
                  "{review.comment || "Formidable !"}"
                </p>

                {review.media && review.media.length > 0 && (
                  <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                    {review.media.map((m: any, idx: number) => (
                      <div key={idx} className="w-16 h-16 shrink-0 border-[3px] border-[#3D405B] rounded-lg relative bg-white p-1 pb-4 shadow-[2px_2px_0_0_#3D405B] -rotate-2">
                        {m.type === 'video' ? (
                          <video src={m.url} className="w-full h-full object-cover border-[2px] border-[#3D405B] sepia-[.3]" />
                        ) : (
                          <img src={m.url} alt="Review media" className="w-full h-full object-cover border-[2px] border-[#3D405B] sepia-[.3]" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t-[3px] border-[#3D405B] border-solid mt-auto">
                  <div className="w-10 h-10 rounded-full bg-[#81B29A] border-[3px] border-[#3D405B] text-[#F4EBD9] flex items-center justify-center font-black text-lg shadow-[2px_2px_0_0_#3D405B]">
                    {(review.is_anonymous ? "A" : (review.client_name?.[0] || "U")).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-wider">{review.is_anonymous ? "Anonyme" : review.client_name}</p>
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
