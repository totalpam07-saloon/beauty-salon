"use client";

import { ClientHomeProps } from "../ClientHome";
import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";
import { 
  Calendar, MapPin, Phone, 
  ChevronRight, Star, Images, X, Play, MessageCircle, 
  Sun, Flower2, Music
} from "lucide-react";

export default function TemplateRetro({ services, settings, portfolio, reviews, onOpenFeed }: ClientHomeProps) {
  const { t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [detailsModalService, setDetailsModalService] = useState<any | null>(null);
  const [fullScreenMedia, setFullScreenMedia] = useState<{url: string, type: string} | null>(null);

  // Group services by category
  const categories = ["all", ...Array.from(new Set(services.filter(s => s.category).map(s => s.category as string)))];
  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const icons = [
    <Sun size={28} />,
    <Flower2 size={28} />,
    <Music size={28} />
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF5] overflow-x-hidden font-serif text-[#4A3B2C] selection:bg-[#FF8A5B] selection:text-white">
      
      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-16 md:pt-32 md:pb-24 px-4 max-w-5xl mx-auto text-center flex flex-col items-center justify-center min-h-[75vh]">
        
        {/* Retro background arches */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-hidden pointer-events-none">
          <div className="w-[80vw] md:w-[50vw] aspect-[3/4] border-[12px] border-[#FFD166]/30 rounded-t-[50vw] absolute -top-10"></div>
          <div className="w-[90vw] md:w-[60vw] aspect-[3/4] border-[12px] border-[#FF8A5B]/20 rounded-t-[50vw] absolute -top-20"></div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-[4rem] p-12 md:p-20 shadow-[0_20px_0_0_rgba(255,138,91,0.2)] border-4 border-[#FF8A5B]/10 w-full max-w-4xl relative">
          {settings?.logoUrl ? (
            <div className="absolute -top-16 -right-4 md:-right-10 w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-[#FFFDF5] shadow-[0_8px_0_0_#FF8A5B] overflow-hidden bg-[#FFD166] rotate-[5deg] z-10 flex items-center justify-center p-2">
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="absolute -top-10 -right-4 w-24 h-24 bg-[#FFD166] rounded-full flex items-center justify-center text-white shadow-[0_8px_0_0_#FF8A5B] rotate-12 z-10">
              <Flower2 size={48} className="animate-[spin_10s_linear_infinite]" />
            </div>
          )}

          <h1 className="text-6xl md:text-8xl font-black text-[#4A3B2C] tracking-tight mb-8 leading-[0.9] drop-shadow-[4px_4px_0_#FFD166]">
            {t("home.title")}
          </h1>
          
          <p className="text-xl md:text-2xl text-[#6B5A4B] mb-12 max-w-2xl mx-auto font-medium leading-relaxed italic">
            {t("home.subtitle")}
          </p>

          <Link href="/book" className="group inline-flex items-center justify-center gap-3 bg-[#FF8A5B] text-white px-12 py-5 rounded-full font-black text-xl shadow-[0_8px_0_0_#E06D43] hover:-translate-y-2 hover:shadow-[0_12px_0_0_#E06D43] active:translate-y-2 active:shadow-none transition-all duration-200">
            <Calendar size={24} className="group-hover:rotate-12 transition-transform" />
            {t("home.bookNow")}
          </Link>
        </div>
      </section>

      {/* Decorative Wave Divider */}
      <div className="w-full h-16 md:h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTQ0MCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGRDM2NiIgZmlsbC1vcGFjaXR5PSIxIiBkPSJNMCAyNTZsNDggLTEwLjcuQzk2IDIzNSA0OSAxOTIgNDkgMTI4UzI4OCAyMSAzODQgMzJsOTYgMTAuN0M1NzYgNTMgNjcyIDg1IDc2OCA4NS4zUzEwNTYgNTMgMTE1MiA1M0wxNDQwIDUzbDAgMzIwbC0xNDQwIDB6Ii8+PC9zdmc+')] bg-cover bg-no-repeat bg-bottom mt-10"></div>

      {/* Services Section */}
      <section className="relative z-10 w-full bg-[#FFD166] py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-[#4A3B2C] drop-shadow-[3px_3px_0_#FFF]">
              {t("home.services")}
            </h2>
          </div>

          {categories.length > 1 && (
            <div className="flex overflow-x-auto pb-6 gap-4 justify-center no-scrollbar mb-10">
              {categories.map((c) => (
                <button key={c} onClick={() => setSelectedCategory(c)}
                  className={`whitespace-nowrap px-8 py-4 rounded-full font-bold text-lg transition-all ${selectedCategory === c ? "bg-[#FF8A5B] text-white shadow-[0_6px_0_0_#E06D43] -translate-y-1" : "bg-white text-[#4A3B2C] shadow-[0_4px_0_0_rgba(74,59,44,0.1)] hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgba(74,59,44,0.1)]"}`}>
                  {c}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredServices.map((service, i) => (
              <div
                key={service.id}
                className="bg-white rounded-[2rem] p-6 flex flex-col group shadow-[0_8px_0_0_rgba(74,59,44,0.15)] hover:-translate-y-2 transition-all duration-300"
              >
                {/* Service image */}
                <div className="w-full h-56 mb-6 relative">
                  <div className="w-full h-full bg-[#FFFDF5] border-4 border-[#FFD166] rounded-3xl flex items-center justify-center overflow-hidden relative">
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 sepia-[.2]"
                      />
                    ) : (
                      <div className="text-[#FF8A5B] bg-[#FFFDF5] w-20 h-20 rounded-full flex items-center justify-center shadow-inner">
                        {icons[i % icons.length]}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-4 -right-2 bg-[#FF8A5B] text-white font-black px-5 py-2 rounded-full shadow-[0_4px_0_0_#E06D43] rotate-[-5deg] flex flex-col items-center justify-center leading-none z-10">
                    <span className="text-xl">${service.priceUSD}</span>
                    <span className="text-[10px] opacity-90 mt-1">{service.priceHTG.toLocaleString()} HTG</span>
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <h3 className="text-2xl font-black text-[#4A3B2C] mb-2 leading-tight">{service.name}</h3>
                  <p className="text-[#6B5A4B] font-bold text-sm mb-6 bg-[#FFFDF5] px-4 py-2 rounded-xl inline-block w-fit border-2 border-[#FFD166]/30">{service.duration}</p>
                  
                  <div className="mt-auto flex items-center gap-3">
                    <button onClick={() => setDetailsModalService(service)} className="flex-1 text-center bg-[#FFFDF5] border-2 border-[#E0D7C8] text-[#4A3B2C] hover:bg-[#FFD166] hover:border-[#FFD166] font-bold py-3 rounded-2xl transition-colors">
                      {t("home.details")}
                    </button>
                    <Link href={`/book?service=${service.id}`} className="flex-1 text-center bg-[#4A3B2C] text-white font-bold py-3 rounded-2xl shadow-[0_4px_0_0_#2A2118] hover:-translate-y-1 hover:shadow-[0_6px_0_0_#2A2118] transition-all">
                      {t("home.book")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Wave Divider */}
      <div className="w-full h-16 md:h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTQ0MCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGQzBBNCIgZmlsbC1vcGFjaXR5PSIxIiBkPSJNMCA2NGw0OCAyMS4zQzk2IDEwNyA0OSAxOTIgNDkgMjU2UzI4OCAzNDEgMzg0IDMzMWw5NiAtMTAuN0M1NzYgMjk5IDY3MiAyNjcgNzY4IDI2Ni43UzEwNTYgMjk5IDExNTIgMjk5TDE0NDAgMjk5bDAgLTMyMGwtMTQ0MCAweiIvPjwvc3ZnPg==')] bg-cover bg-no-repeat bg-top bg-[#FF8A5B] rotate-180"></div>

      {/* Portfolio Preview Strip */}
      {portfolio.length > 0 && (
        <section className="w-full bg-[#FF8A5B] py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <h2 className="text-4xl md:text-6xl font-black text-[#FFFDF5] drop-shadow-[3px_3px_0_#E06D43]">
                {t("home.portfolioPreview")}
              </h2>
              <Link href="/portfolio"
                className="hidden md:flex items-center gap-2 bg-[#FFFDF5] text-[#FF8A5B] px-8 py-4 rounded-full font-black shadow-[0_6px_0_0_#4A3B2C] hover:-translate-y-1 transition-all border-4 border-[#4A3B2C]">
                {t("home.seeAll")} <ChevronRight size={20} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {portfolio.slice(0, 4).map((photo, index) => (
                <Link key={photo.id} href="/portfolio"
                  className={`aspect-[3/4] rounded-[2rem] overflow-hidden block group border-8 border-white shadow-[0_10px_0_0_#4A3B2C] hover:-translate-y-3 transition-all duration-300 ${index % 2 === 0 ? 'rotate-[-2deg]' : 'rotate-[2deg]'}`}>
                  <img
                    src={photo.imageUrl}
                    alt={photo.category}
                    className="w-full h-full object-cover sepia-[.2] group-hover:sepia-0 transition-all duration-500"
                  />
                </Link>
              ))}
            </div>
            <div className="mt-12 flex justify-center md:hidden">
              <Link href="/portfolio"
                className="flex items-center gap-2 bg-[#FFFDF5] text-[#FF8A5B] px-8 py-4 rounded-full font-black shadow-[0_6px_0_0_#4A3B2C] border-4 border-[#4A3B2C]">
                {t("home.seeAll")} <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      {reviews && reviews.length > 0 && (
        <section className="w-full bg-[#FFFDF5] py-20 md:py-32">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-16 relative">
              <h2 className="text-4xl md:text-6xl font-black text-[#4A3B2C] drop-shadow-[3px_3px_0_#FFD166] inline-block relative z-10">
                {t("home.reviewsTitle")}
              </h2>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-8 bg-[#FFD166] opacity-30 -z-10 rounded-full blur-md"></div>
            </div>
            
            <div className="flex items-start overflow-x-auto gap-8 pb-12 no-scrollbar snap-x snap-mandatory px-4 md:px-0">
              {reviews.map((review, i) => (
                <div key={review.id} className={`min-w-[320px] max-w-[380px] bg-white border-4 border-[#4A3B2C] rounded-[3rem] p-8 shadow-[10px_10px_0_0_#FFD166] snap-center shrink-0 ${i % 2 !== 0 ? 'mt-8' : ''}`}>
                  <div className="flex gap-1 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={24} className={review.rating >= star ? "fill-[#FF8A5B] text-[#FF8A5B]" : "text-[#E0D7C8] fill-[#E0D7C8]"} />
                    ))}
                  </div>
                  <p className="text-[#4A3B2C] font-bold text-xl leading-relaxed mb-10 italic">
                    "{review.comment}"
                  </p>
                  
                  {/* Media Attachment */}
                  {review.media && review.media.length > 0 ? (
                    <div 
                      className="mb-8 rounded-3xl overflow-hidden shadow-inner border-2 border-[#E0D7C8] aspect-square bg-[#FFFDF5] relative cursor-pointer group"
                      onClick={() => onOpenFeed && onOpenFeed(review.id)}
                    >
                      {review.media[0].type === 'video' ? (
                        <>
                          <video 
                            src={review.media[0].url} 
                            className="w-full h-full object-cover sepia-[.1]"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-[#FF8A5B] text-white rounded-full flex items-center justify-center shadow-[0_4px_0_0_#E06D43] group-hover:scale-110 transition-transform">
                              <Play fill="currentColor" size={28} className="ml-1" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <img 
                          src={review.media[0].url} 
                          alt="Review media" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 sepia-[.1]"
                        />
                      )}
                    </div>
                  ) : null}

                  <div className="flex items-center gap-4 bg-[#FFFDF5] rounded-full p-3 border-2 border-[#FFD166]">
                    <div className="w-12 h-12 bg-[#FFD166] rounded-full flex items-center justify-center text-[#4A3B2C] font-black text-xl shadow-inner">
                      {review.isAnonymous ? "?" : review.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-[#4A3B2C]">
                        {review.isAnonymous ? t("home.anonymous") : review.clientName}
                      </p>
                      <p className="text-sm text-[#FF8A5B] font-bold">{review.serviceName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Details Modal */}
      {detailsModalService && (
        <div className="fixed inset-0 z-50 bg-[#4A3B2C]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setDetailsModalService(null)}>
          <div className="bg-[#FFFDF5] border-8 border-[#FFD166] rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-[16px_16px_0_0_#FF8A5B] relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setDetailsModalService(null)} className="absolute top-6 right-6 bg-white text-[#4A3B2C] border-4 border-[#4A3B2C] rounded-full p-2 hover:bg-[#FF8A5B] hover:text-white transition-colors z-10 shadow-[0_4px_0_0_#4A3B2C]">
              <X size={24} strokeWidth={3} />
            </button>
            {detailsModalService.imageUrl && (
              <div className="w-full h-72 border-b-8 border-[#FFD166]">
                <img src={detailsModalService.imageUrl} alt={detailsModalService.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-8 md:p-12 space-y-8">
              <div className="text-center">
                {detailsModalService.category && (
                  <span className="inline-block mb-6 text-sm font-black bg-[#FF8A5B] text-white px-6 py-2 rounded-full uppercase tracking-wider shadow-[0_4px_0_0_#E06D43] rotate-[-2deg]">{detailsModalService.category}</span>
                )}
                <h3 className="text-4xl md:text-5xl font-black text-[#4A3B2C] drop-shadow-[2px_2px_0_#FFD166] leading-tight">{detailsModalService.name}</h3>
              </div>
              
              {detailsModalService.description ? (
                <div className="text-[#6B5A4B] leading-relaxed font-bold text-lg bg-white border-4 border-[#E0D7C8] p-8 rounded-[2rem]">
                  {detailsModalService.description}
                </div>
              ) : (
                <p className="text-[#6B5A4B] text-sm font-bold italic text-center opacity-50">{t("home.noDescription")}</p>
              )}

              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-8 border-t-4 border-dashed border-[#FFD166]">
                <div className="bg-white border-4 border-[#4A3B2C] rounded-[2rem] p-6 text-center shadow-[4px_4px_0_0_#4A3B2C] w-full sm:w-auto">
                  <p className="text-sm font-black text-[#FF8A5B] uppercase tracking-widest mb-2">{t("home.durationAndPrice")}</p>
                  <p className="text-3xl font-black text-[#4A3B2C] flex justify-center items-center gap-3">
                    {detailsModalService.duration}
                    <span className="bg-[#FFD166] px-3 py-1 rounded-xl rotate-3">${detailsModalService.priceUSD}</span>
                  </p>
                </div>
                <div className="flex w-full sm:w-auto gap-4 flex-col">
                  {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-3 bg-white text-[#25D366] border-4 border-[#25D366] px-8 py-4 rounded-[2rem] font-black uppercase text-sm shadow-[0_6px_0_0_#25D366] hover:-translate-y-1 transition-all whitespace-nowrap">
                      <MessageCircle size={24} /> {t("home.inquire")}
                    </a>
                  )}
                  <Link href={`/book?service=${detailsModalService.id}`} 
                    className="flex-1 flex items-center justify-center bg-[#4A3B2C] text-white border-4 border-[#4A3B2C] px-10 py-4 rounded-[2rem] font-black uppercase text-xl shadow-[0_6px_0_0_#2A2118] hover:-translate-y-1 transition-all">
                    {t("home.book")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Media Modal */}
      {fullScreenMedia && (
        <div 
          className="fixed inset-0 z-[60] bg-[#4A3B2C]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setFullScreenMedia(null)}
        >
          <button 
            onClick={() => setFullScreenMedia(null)} 
            className="absolute top-6 right-6 md:top-10 md:right-10 bg-[#FFD166] text-[#4A3B2C] border-4 border-[#4A3B2C] rounded-full p-4 hover:bg-white transition-colors z-10 shadow-[0_4px_0_0_#4A3B2C]"
          >
            <X size={28} strokeWidth={3} />
          </button>
          
          <div 
            className="w-full max-w-5xl max-h-[90vh] flex items-center justify-center border-8 border-white rounded-[3rem] shadow-[0_20px_0_0_#FF8A5B] overflow-hidden bg-black relative"
            onClick={(e) => e.stopPropagation()}
          >
            {fullScreenMedia.type === 'video' ? (
              <video 
                src={fullScreenMedia.url} 
                className="max-w-full max-h-[90vh] object-contain"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img 
                src={fullScreenMedia.url} 
                alt="Fullscreen media" 
                className="max-w-full max-h-[90vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
