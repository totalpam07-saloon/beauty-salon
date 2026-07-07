"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { Service, SalonSettings, PortfolioPhoto } from "@/store/salon";
import { Calendar, ChevronRight, Sparkles, Scissors, Smile, ImageIcon, Images, X, MessageCircle, Star, Play } from "lucide-react";
import Link from "next/link";

const icons = [
  <Scissors className="w-6 h-6 text-primary" key="scissors" />,
  <Sparkles className="w-6 h-6 text-primary" key="sparkles" />,
  <Smile className="w-6 h-6 text-primary" key="smile" />,
];

import { ClientHomeProps } from "../ClientHome";

export default function TemplatePop({ services, settings, portfolio, reviews = [], tenantDomain, onOpenFeed }: ClientHomeProps) {
  const { t } = useI18n();
  const [detailsModalService, setDetailsModalService] = useState<Service | null>(null);
  const [fullScreenMedia, setFullScreenMedia] = useState<{url: string, type: 'image'|'video'} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categories = ["Tous", ...new Set(services.map(s => s.category).filter(Boolean))] as string[];
  const filteredServices = selectedCategory === "Tous" ? services : services.filter(s => s.category === selectedCategory);

  return (
    <div className="flex-1 w-full bg-[#FAFAFA] font-sans transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative w-full h-[450px] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Banner image or fallback gradient blob */}
        {settings.bannerUrl ? (
          <>
            <img
              src={settings.bannerUrl}
              alt="Banner"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-black/50 z-0" />
          </>
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/20 rounded-full blur-[80px] -z-10" />
        )}

        <div className={`relative z-10 border-4 border-black p-8 md:p-12 rounded-[2rem] max-w-2xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${settings.bannerUrl ? "backdrop-blur-md bg-white/90" : ""}`}>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-black uppercase">
            {t("home.title")}
          </h1>
          <p className="text-lg md:text-xl font-bold mb-8 text-black/80">
            {t("home.subtitle")}
          </p>
          <div className="flex justify-center">
            <Link href="/book" className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 uppercase tracking-wider">
              <Calendar size={24} />
              {t("home.bookNow")}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="bg-[#FFE5E5] border-4 border-black rounded-[2rem] p-6 inline-block mb-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
          <h2 className="text-3xl md:text-5xl font-black text-black flex items-center gap-4 uppercase">
            <Sparkles className="text-black fill-black w-8 h-8 md:w-12 md:h-12" />
            {t("home.services")}
          </h2>
        </div>

        {categories.length > 1 && (
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 no-scrollbar mb-6">
            {categories.map((c) => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={`whitespace-nowrap px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wide border-4 transition-all ${selectedCategory === c ? "bg-primary text-primary-foreground border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-0" : "bg-white border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"}`}>
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredServices.map((service, i) => (
            <div
              key={service.id}
              className="bg-white border-4 border-black rounded-[2rem] p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex flex-col group"
            >
              {/* Service image */}
              <div className="w-full h-48 bg-[#F0F0F0] border-4 border-black rounded-[1.5rem] flex items-center justify-center overflow-hidden mb-4">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-primary border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="text-primary-foreground">
                        {icons[i % icons.length]}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1">
                <div>
                  <h3 className="text-2xl font-black text-black mb-1 uppercase leading-tight">{service.name}</h3>
                  <p className="text-black/60 font-bold text-sm">{service.duration}</p>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#E5FF00] border-4 border-black rounded-xl px-4 py-1 text-2xl font-black text-black inline-block transform -rotate-2">${service.priceUSD}</span>
                    <span className="text-sm font-black text-black/40">{service.priceHTG.toLocaleString()} HTG</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setDetailsModalService(service)} className="flex-1 text-xs font-black bg-white border-4 border-black text-black px-4 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase">
                      {t("home.details")}
                    </button>
                    <Link href={`/book?service=${service.id}`} className="flex-1 text-center text-xs font-black bg-primary border-4 border-black text-primary-foreground px-4 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase">
                      {t("home.book")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Preview Strip */}
      {portfolio.length > 0 && (
        <section className="w-full bg-[#E5F5FF] border-y-4 border-black py-16 md:py-24 overflow-hidden relative">
          <div className="absolute top-10 left-10 w-20 h-20 bg-[#FFE5E5] border-4 border-black rounded-full mix-blend-multiply blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#E5FF00] border-4 border-black rounded-full mix-blend-multiply blur-xl animate-pulse"></div>
          
          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div className="bg-white border-4 border-black rounded-[1.5rem] p-4 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-2">
                <h2 className="text-2xl md:text-3xl font-black text-black flex items-center gap-3 uppercase">
                  <Images className="text-black w-7 h-7" />
                  {t("home.portfolioPreview")}
                </h2>
              </div>
              <Link href="/portfolio"
                className="bg-primary text-primary-foreground border-4 border-black px-6 py-2 rounded-full font-black text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                {t("home.seeAll")}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {portfolio.slice(0, 6).map((photo) => (
                <Link key={photo.id} href="/portfolio"
                  className="aspect-square rounded-[1.5rem] overflow-hidden block group shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 border-4 border-black transition-all bg-white">
                  <img
                    src={photo.imageUrl}
                    alt={photo.category}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="w-full bg-[#FAFAFA] py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex justify-center mb-12">
              <div className="bg-[#E5FF00] border-4 border-black rounded-[1.5rem] p-4 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2">
                <h2 className="text-3xl md:text-4xl font-black text-black flex items-center justify-center gap-3 uppercase">
                  <Star className="text-black w-8 h-8 fill-black" />
                  {t("home.reviewsTitle")}
                </h2>
              </div>
            </div>
            <div className="flex items-start overflow-x-auto gap-8 pb-8 no-scrollbar snap-x snap-mandatory px-2">
              {reviews.map((review) => (
                <div key={review.id} className="min-w-[320px] max-w-[380px] bg-white border-4 border-black rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] snap-center shrink-0">
                  <div className="flex gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={24} className={review.rating >= star ? "fill-primary text-primary drop-shadow-sm" : "text-black/10"} />
                    ))}
                  </div>
                  <p className="text-black font-bold text-lg mb-8 line-clamp-4 leading-tight">
                    "{review.comment}"
                  </p>
                  
                  {/* Media Attachment */}
                  {review.media && review.media.length > 0 ? (
                    <div 
                      className="mb-6 rounded-2xl overflow-hidden shadow-sm aspect-video bg-black relative cursor-pointer group"
                      onClick={() => onOpenFeed && onOpenFeed(review.id)}
                    >
                      {review.media[0].type === 'video' ? (
                        <>
                          <video 
                            src={review.media[0].url} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white shadow-lg">
                              <Play fill="currentColor" size={20} className="ml-1" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <img 
                          src={review.media[0].url} 
                          alt="Review media" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                  ) : null}

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                      {review.isAnonymous ? "?" : review.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        {review.isAnonymous ? t("home.anonymous") : review.clientName}
                      </p>
                      <p className="text-xs text-foreground/50 font-medium">{t("home.service")}: {review.serviceName}</p>
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
        <div className="fixed inset-0 z-50 bg-[#E5FF00]/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setDetailsModalService(null)}>
          <div className="bg-white border-8 border-black rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setDetailsModalService(null)} className="absolute top-6 right-6 bg-[#FFE5E5] text-black border-4 border-black rounded-full p-2 hover:bg-white transition-colors z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <X size={24} className="stroke-[3px]" />
            </button>
            {detailsModalService.imageUrl && (
              <div className="w-full h-72 bg-black border-b-8 border-black p-2">
                <img src={detailsModalService.imageUrl} alt={detailsModalService.name} className="w-full h-full object-cover rounded-t-[1.5rem]" />
              </div>
            )}
            <div className="p-8 md:p-10 space-y-6">
              <div>
                {detailsModalService.category && (
                  <span className="inline-block mb-3 text-sm font-black bg-black text-white px-4 py-1.5 rounded-full uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">{detailsModalService.category}</span>
                )}
                <h3 className="text-4xl font-black text-black leading-tight uppercase">{detailsModalService.name}</h3>
              </div>
              
              {detailsModalService.description ? (
                <div className="text-black/80 leading-relaxed font-bold text-lg p-6 bg-[#F0F0F0] border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {detailsModalService.description}
                </div>
              ) : (
                <p className="text-black/50 text-sm font-bold italic">{t("home.noDescription")}</p>
              )}

              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="w-full sm:w-auto bg-[#E5F5FF] border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-sm font-black text-black/60 uppercase tracking-wider mb-1">{t("home.durationAndPrice")}</p>
                  <p className="text-xl font-black text-black flex items-center gap-3">
                    {detailsModalService.duration}
                    <span className="bg-[#E5FF00] border-2 border-black rounded-lg px-2 py-0.5 text-2xl rotate-2">${detailsModalService.priceUSD} <span className="text-sm opacity-70 ml-2 font-bold whitespace-nowrap">/ {detailsModalService.priceHTG.toLocaleString()} HTG</span></span>
                  </p>
                </div>
                <div className="flex w-full sm:w-auto gap-4 flex-col">
                  {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white border-4 border-black px-6 py-4 rounded-2xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <MessageCircle size={24} /> {t("home.inquire")}
                    </a>
                  )}
                  <Link href={`/book?service=${detailsModalService.id}`} 
                    className="flex-1 flex items-center justify-center bg-primary text-primary-foreground border-4 border-black px-8 py-4 rounded-2xl font-black uppercase text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
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
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setFullScreenMedia(null)}
        >
          <button 
            onClick={() => setFullScreenMedia(null)} 
            className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/10 text-white rounded-full p-3 hover:bg-white/20 transition-colors z-10"
          >
            <X size={24} />
          </button>
          
          <div 
            className="w-full max-w-5xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {fullScreenMedia.type === 'video' ? (
              <video 
                src={fullScreenMedia.url} 
                controls 
                autoPlay
                className="w-full h-auto max-h-[90vh] rounded-lg shadow-2xl object-contain"
              />
            ) : (
              <img 
                src={fullScreenMedia.url} 
                alt="Fullscreen media" 
                className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
