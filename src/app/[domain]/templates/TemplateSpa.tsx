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

export default function TemplateSpa({ services, settings, portfolio, reviews = [], tenantDomain, onOpenFeed }: ClientHomeProps) {
  const { t } = useI18n();
  const [detailsModalService, setDetailsModalService] = useState<Service | null>(null);
  const [fullScreenMedia, setFullScreenMedia] = useState<{url: string, type: 'image'|'video'} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categories = ["Tous", ...new Set(services.map(s => s.category).filter(Boolean))] as string[];
  const filteredServices = selectedCategory === "Tous" ? services : services.filter(s => s.category === selectedCategory);

  return (
    <div className="flex-1 w-full bg-[#F9F6F0] text-[#5C5447] transition-colors duration-300">
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

        <h1 className={`relative z-10 text-4xl md:text-5xl font-light tracking-wide mb-6 ${settings.bannerUrl ? "text-white" : "text-[#3D372F]"}`}>
          {t("home.title")}
        </h1>
        <p className={`relative z-10 text-lg md:text-xl max-w-xl mb-12 font-light leading-relaxed ${settings.bannerUrl ? "text-white/90" : "text-[#7A7265]"}`}>
          {t("home.subtitle")}
        </p>
        <Link href="/book" className="relative z-10 flex items-center gap-2 bg-transparent border border-primary text-primary px-10 py-3 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300">
          <Calendar size={18} />
          {t("home.bookNow")}
        </Link>
      </section>

      {/* Services Section */}
      <section className="max-w-4xl mx-auto px-4 py-20 md:py-32">
        <div className="text-center mb-16">
          <p className="text-primary text-sm tracking-widest uppercase mb-4">{t("home.services")}</p>
          <h2 className="text-3xl font-light text-[#3D372F]">{t("home.spaServicesTitle")}</h2>
        </div>

        {categories.length > 1 && (
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-8 justify-center no-scrollbar mb-8 border-b border-[#E5DFD3]">
            {categories.map((c) => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={`whitespace-nowrap pb-4 font-medium text-sm transition-all border-b-2 ${selectedCategory === c ? "text-[#3D372F] border-primary" : "border-transparent text-[#7A7265] hover:text-[#3D372F]"}`}>
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {filteredServices.map((service, i) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col group hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500"
            >
              {/* Service image */}
              <div className="w-full h-48 bg-[#F9F6F0] rounded-xl flex items-center justify-center overflow-hidden mb-6">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                ) : (
                  <div className="text-[#E5DFD3]">
                    {icons[i % icons.length]}
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-[#3D372F] leading-tight">{service.name}</h3>
                  <span className="text-lg font-light text-[#3D372F] ml-4">${service.priceUSD}</span>
                </div>
                <p className="text-[#7A7265] text-sm mb-6">{service.duration}</p>

                <div className="mt-auto flex items-center justify-between border-t border-[#F9F6F0] pt-4">
                  <button onClick={() => setDetailsModalService(service)} className="text-xs tracking-wider text-[#7A7265] hover:text-[#3D372F] transition-colors">
                    {t("home.details")}
                  </button>
                  <Link href={`/book?service=${service.id}`} className="text-xs tracking-wider text-primary hover:opacity-80 transition-opacity uppercase">
                    {t("home.book")}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Preview Strip */}
      {portfolio.length > 0 && (
        <section className="w-full bg-white py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-primary text-sm tracking-widest uppercase mb-4">{t("home.portfolioPreview")}</p>
              <h2 className="text-3xl font-light text-[#3D372F] mb-6">{t("home.spaPortfolioTitle")}</h2>
              <Link href="/portfolio"
                className="inline-block text-sm text-[#7A7265] border-b border-[#7A7265] pb-1 hover:text-[#3D372F] hover:border-[#3D372F] transition-colors">
                {t("home.seeAll")}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {portfolio.slice(0, 4).map((photo) => (
                <Link key={photo.id} href="/portfolio"
                  className="aspect-[4/5] rounded-xl overflow-hidden block group">
                  <img
                    src={photo.imageUrl}
                    alt={photo.category}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="w-full bg-[#F9F6F0] py-20 md:py-32">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-primary text-sm tracking-widest uppercase mb-4">{t("home.reviewsTitle")}</p>
              <h2 className="text-3xl font-light text-[#3D372F]">{t("home.spaReviewsTitle")}</h2>
            </div>
            <div className="flex items-start overflow-x-auto gap-8 pb-12 no-scrollbar snap-x snap-mandatory px-4">
              {reviews.map((review) => (
                <div key={review.id} className="min-w-[300px] max-w-[360px] bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] snap-center shrink-0">
                  <p className="text-[#5C5447] font-light leading-relaxed mb-8 line-clamp-4">
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
        <div className="fixed inset-0 z-50 bg-[#3D372F]/20 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setDetailsModalService(null)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setDetailsModalService(null)} className="absolute top-4 right-4 bg-white/80 text-[#3D372F] rounded-full p-2 hover:bg-[#F9F6F0] transition-colors z-10">
              <X size={20} />
            </button>
            {detailsModalService.imageUrl && (
              <div className="w-full h-64 bg-[#F9F6F0]">
                <img src={detailsModalService.imageUrl} alt={detailsModalService.name} className="w-full h-full object-cover opacity-90" />
              </div>
            )}
            <div className="p-8 md:p-12 space-y-6">
              <div className="text-center">
                {detailsModalService.category && (
                  <span className="inline-block mb-3 text-xs tracking-widest text-[#7A7265] uppercase">{detailsModalService.category}</span>
                )}
                <h3 className="text-2xl font-medium text-[#3D372F]">{detailsModalService.name}</h3>
              </div>
              
              {detailsModalService.description ? (
                <div className="text-[#5C5447] leading-relaxed font-light text-center">
                  {detailsModalService.description}
                </div>
              ) : (
                <p className="text-[#7A7265] text-sm italic text-center">{t("home.noDescription")}</p>
              )}

              <div className="border-t border-[#F9F6F0] pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-lg font-medium text-[#3D372F]">${detailsModalService.priceUSD} <span className="text-sm opacity-70 ml-2 font-bold whitespace-nowrap">/ {detailsModalService.priceHTG.toLocaleString()} HTG</span> <span className="text-sm font-light text-[#7A7265] ml-2">({detailsModalService.duration})</span></p>
                </div>
                <div className="flex w-full sm:w-auto gap-3 flex-col sm:flex-row">
                  {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-[#E5DFD3] text-[#5C5447] px-6 py-3 rounded-full hover:bg-[#F9F6F0] transition-all whitespace-nowrap">
                      <MessageCircle size={18} /> {t("home.inquire")}
                    </a>
                  )}
                  <Link href={`/book?service=${detailsModalService.id}`} 
                    className="flex-1 sm:flex-none flex items-center justify-center bg-[#3D372F] text-white px-8 py-3 rounded-full hover:bg-black transition-all">
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
