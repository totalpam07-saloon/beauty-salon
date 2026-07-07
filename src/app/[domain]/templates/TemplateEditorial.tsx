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

export default function TemplateEditorial({ services, settings, portfolio, reviews = [], tenantDomain, onOpenFeed }: ClientHomeProps) {
  const { t } = useI18n();
  const [detailsModalService, setDetailsModalService] = useState<Service | null>(null);
  const [fullScreenMedia, setFullScreenMedia] = useState<{url: string, type: 'image'|'video'} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categories = ["Tous", ...new Set(services.map(s => s.category).filter(Boolean))] as string[];
  const filteredServices = selectedCategory === "Tous" ? services : services.filter(s => s.category === selectedCategory);

  return (
    <div className="flex-1 w-full bg-white text-black transition-colors duration-300">
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

        <h1 className={`relative z-10 text-6xl md:text-8xl font-serif tracking-tighter mb-6 leading-none ${settings.bannerUrl ? "text-white" : "text-black"}`}>
          {t("home.title")}
        </h1>
        <div className={`relative z-10 w-16 h-px mb-8 ${settings.bannerUrl ? "bg-white" : "bg-black"}`}></div>
        <p className={`relative z-10 text-xl md:text-2xl max-w-xl mb-12 font-light tracking-wide uppercase ${settings.bannerUrl ? "text-white/90" : "text-black/70"}`}>
          {t("home.subtitle")}
        </p>
        <Link href="/book" className="relative z-10 flex items-center gap-4 bg-transparent border border-primary text-primary px-12 py-5 rounded-none font-serif uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-500">
          <Calendar size={18} />
          {t("home.bookNow")}
        </Link>
      </section>

      {/* Services Section */}
      <section className="max-w-[1400px] mx-auto px-6 py-24 md:py-32">
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-black pb-8 mb-16">
          <h2 className="text-5xl md:text-7xl font-serif tracking-tighter text-black uppercase">
            {t("home.services")}
          </h2>
          <span className="text-sm tracking-widest uppercase mt-4 md:mt-0 text-black/50">{t("home.collection")}</span>
        </div>

        {categories.length > 1 && (
          <div className="flex overflow-x-auto pb-4 gap-12 no-scrollbar mb-16">
            {categories.map((c) => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={`whitespace-nowrap pb-2 font-serif uppercase tracking-widest text-sm transition-all ${selectedCategory === c ? "text-black border-b border-black" : "border-b border-transparent text-black/40 hover:text-black"}`}>
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {filteredServices.map((service, i) => (
            <div
              key={service.id}
              className="flex flex-col group"
            >
              {/* Service image */}
              <div className="w-full aspect-[3/4] bg-zinc-100 flex items-center justify-center overflow-hidden mb-6 relative">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="text-black/20">
                    <span className="text-8xl font-serif opacity-10">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white text-black text-xs font-serif px-3 py-1 uppercase tracking-widest">
                  No. {String(i + 1).padStart(2, '0')}
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <h3 className="text-2xl font-serif text-black uppercase tracking-wide mb-2">{service.name}</h3>
                <div className="w-full h-px bg-black/10 my-4"></div>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-black/60 font-light text-sm tracking-widest uppercase">{service.duration}</span>
                  <span className="text-xl font-serif text-black">${service.priceUSD}</span>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-px bg-black/10 border border-black/10">
                  <button onClick={() => setDetailsModalService(service)} className="bg-white text-xs font-serif uppercase tracking-widest text-black/60 hover:text-black py-4 transition-colors">
                    {t("home.details")}
                  </button>
                  <Link href={`/book?service=${service.id}`} className="bg-black text-white text-xs font-serif uppercase tracking-widest text-center py-4 hover:bg-black/80 transition-colors">
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
        <section className="w-full bg-zinc-50 border-t border-black py-24 md:py-32">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-black pb-8 mb-16">
              <h2 className="text-5xl md:text-7xl font-serif tracking-tighter text-black uppercase">
                {t("home.editorialTitle")}
              </h2>
              <Link href="/portfolio"
                className="text-sm font-serif uppercase tracking-widest text-black/60 hover:text-black border-b border-black/30 hover:border-black pb-1 transition-all mt-6 md:mt-0">
                {t("home.seeAll")}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {portfolio.slice(0, 4).map((photo) => (
                <Link key={photo.id} href="/portfolio"
                  className="aspect-[3/4] overflow-hidden block group bg-white">
                  <img
                    src={photo.imageUrl}
                    alt={photo.category}
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="w-full bg-black text-white py-24 md:py-32">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="border-b border-white/20 pb-8 mb-16">
              <h2 className="text-5xl md:text-7xl font-serif tracking-tighter uppercase">
                {t("home.reviewsTitle")}
              </h2>
            </div>
            <div className="flex items-start overflow-x-auto gap-12 pb-8 no-scrollbar snap-x snap-mandatory">
              {reviews.map((review) => (
                <div key={review.id} className="min-w-[350px] max-w-[450px] snap-center shrink-0 border-l border-white/20 pl-8">
                  <p className="text-white/90 font-serif text-2xl md:text-3xl leading-snug mb-8 line-clamp-5">
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
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-end animate-in slide-in-from-right duration-300" onClick={() => setDetailsModalService(null)}>
          <div className="bg-white w-full max-w-2xl h-full overflow-y-auto overflow-x-hidden relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setDetailsModalService(null)} className="absolute top-6 right-6 bg-white border border-black text-black rounded-none p-3 hover:bg-black hover:text-white transition-colors z-10">
              <X size={20} className="stroke-[1.5px]" />
            </button>
            {detailsModalService.imageUrl && (
              <div className="w-full h-[40vh] bg-zinc-100">
                <img src={detailsModalService.imageUrl} alt={detailsModalService.name} className="w-full h-full object-cover grayscale" />
              </div>
            )}
            <div className="p-10 md:p-16 space-y-8">
              <div>
                {detailsModalService.category && (
                  <span className="inline-block mb-6 text-xs font-serif tracking-widest text-black/50 border border-black/20 px-4 py-2 uppercase">{detailsModalService.category}</span>
                )}
                <h3 className="text-4xl md:text-5xl font-serif text-black uppercase tracking-tighter leading-tight">{detailsModalService.name}</h3>
                <div className="w-16 h-px bg-black my-8"></div>
              </div>
              
              {detailsModalService.description ? (
                <div className="text-black/70 leading-loose font-light text-lg whitespace-pre-wrap">
                  {detailsModalService.description}
                </div>
              ) : (
                <p className="text-black/40 text-sm font-serif italic">{t("home.noDescription")}</p>
              )}

              <div className="border-t border-black pt-8 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="w-full sm:w-auto">
                  <p className="text-xs font-serif text-black/50 uppercase tracking-widest mb-2">{t("home.durationAndPrice")}</p>
                  <p className="text-lg tracking-widest text-black">{detailsModalService.duration} <span className="mx-4 text-black/20">|</span> <span className="text-3xl font-serif">${detailsModalService.priceUSD} <span className="text-sm opacity-70 ml-2 font-bold whitespace-nowrap">/ {detailsModalService.priceHTG.toLocaleString()} HTG</span></span></p>
                </div>
                <div className="flex w-full sm:w-auto gap-4 flex-col sm:flex-row">
                  {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-3 border border-black text-black px-8 py-4 font-serif uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all whitespace-nowrap">
                      <MessageCircle size={16} strokeWidth={1.5} /> {t("home.inquire")}
                    </a>
                  )}
                  <Link href={`/book?service=${detailsModalService.id}`} 
                    className="flex-1 sm:flex-none flex items-center justify-center bg-primary text-primary-foreground px-12 py-4 font-serif uppercase tracking-widest text-sm hover:opacity-80 transition-opacity border border-primary">
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
