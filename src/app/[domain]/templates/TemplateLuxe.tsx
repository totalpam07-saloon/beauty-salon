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

export default function TemplateLuxe({ services, settings, portfolio, reviews = [], tenantDomain, onOpenFeed }: ClientHomeProps) {
  const { t } = useI18n();
  const [detailsModalService, setDetailsModalService] = useState<Service | null>(null);
  const [fullScreenMedia, setFullScreenMedia] = useState<{url: string, type: 'image'|'video'} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categories = ["Tous", ...new Set(services.map(s => s.category).filter(Boolean))] as string[];
  const filteredServices = selectedCategory === "Tous" ? services : services.filter(s => s.category === selectedCategory);

  return (
    <div className="flex-1 w-full bg-zinc-950 text-zinc-100 transition-colors duration-300">
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

        <h1 className={`relative z-10 text-4xl md:text-6xl font-serif font-light tracking-widest uppercase mb-4 drop-shadow-sm ${settings.bannerUrl ? "text-white" : "text-zinc-100"}`}>
          {t("home.title")}
        </h1>
        <p className={`relative z-10 text-lg md:text-xl max-w-lg mb-10 font-light tracking-wide ${settings.bannerUrl ? "text-white/80" : "text-zinc-400"}`}>
          {t("home.subtitle")}
        </p>
        <Link href="/book" className="relative z-10 flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 font-serif uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all duration-500">
          <Calendar size={18} />
          {t("home.bookNow")}
        </Link>
      </section>

      {/* Services Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center justify-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-widest text-zinc-100 mb-2">
            {t("home.services")}
          </h2>
          <div className="w-12 h-0.5 bg-primary mt-4"></div>
        </div>

        {categories.length > 1 && (
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-3 no-scrollbar mb-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={`whitespace-nowrap px-6 py-3 rounded-full font-bold text-sm transition-all border-2 ${selectedCategory === c ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card border-border text-foreground/80 hover:border-primary/50"}`}>
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredServices.map((service, i) => (
            <div
              key={service.id}
              className="bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col overflow-hidden group hover:border-primary/50 transition-all duration-500"
            >
              {/* Service image */}
              <div className="w-full h-56 bg-zinc-950 flex items-center justify-center overflow-hidden relative">
                {service.imageUrl ? (
                  <>
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-60 transition-all duration-700 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-700">
                    <div className="w-16 h-16 border border-zinc-800 rounded-full flex items-center justify-center group-hover:border-primary/50 transition-all duration-500">
                      <div className="text-zinc-600 group-hover:text-primary transition-colors duration-500">
                        {icons[i % icons.length]}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between relative bg-zinc-900">
                <div className="absolute -top-6 right-6 bg-zinc-900 border border-zinc-800 text-primary font-serif font-bold px-4 py-2 text-lg shadow-lg">
                  ${service.priceUSD}
                </div>
                
                <div className="mt-4">
                  <h3 className="text-xl font-serif text-zinc-100 mb-2 uppercase tracking-wide">{service.name}</h3>
                  <p className="text-zinc-500 font-light text-sm tracking-wider uppercase">{service.duration}</p>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <span className="text-sm font-light text-zinc-600">{service.priceHTG.toLocaleString()} HTG</span>
                  <div className="flex gap-3">
                    <button onClick={() => setDetailsModalService(service)} className="text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-100 transition-colors">
                      {t("home.details")}
                    </button>
                    <Link href={`/book?service=${service.id}`} className="text-xs uppercase tracking-widest text-primary hover:text-primary-foreground hover:bg-primary px-4 py-2 border border-primary transition-all">
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
        <section className="w-full bg-zinc-900 border-y border-zinc-800 py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col items-center justify-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-widest text-zinc-100 mb-2">
                {t("home.portfolioPreview")}
              </h2>
              <div className="w-12 h-0.5 bg-primary mt-4 mb-6"></div>
              <Link href="/portfolio"
                className="flex items-center gap-2 text-sm uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors">
                {t("home.seeAll")} <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {portfolio.slice(0, 6).map((photo) => (
                <Link key={photo.id} href="/portfolio"
                  className="aspect-square bg-zinc-950 overflow-hidden block group border border-zinc-800 hover:border-primary/50 transition-all duration-500">
                  <img
                    src={photo.imageUrl}
                    alt={photo.category}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="w-full bg-zinc-950 py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col items-center justify-center mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-widest text-zinc-100 mb-2">
                {t("home.reviewsTitle")}
              </h2>
              <div className="w-12 h-0.5 bg-primary mt-4"></div>
            </div>
            <div className="flex items-start overflow-x-auto gap-8 pb-8 no-scrollbar snap-x snap-mandatory">
              {reviews.map((review) => (
                <div key={review.id} className="min-w-[320px] max-w-[400px] bg-zinc-900 border border-zinc-800 p-8 shadow-2xl snap-center shrink-0 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-2 mb-6 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} className={review.rating >= star ? "fill-primary text-primary" : "text-zinc-800"} />
                      ))}
                    </div>
                    <p className="text-zinc-400 font-serif italic text-lg leading-relaxed text-center mb-8 line-clamp-4">
                      "{review.comment}"
                    </p>
                  </div>
                  
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setDetailsModalService(null)}>
          <div className="bg-zinc-900 border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setDetailsModalService(null)} className="absolute top-6 right-6 bg-zinc-950 text-zinc-400 hover:text-white rounded-none border border-zinc-800 p-2 transition-colors z-10">
              <X size={20} />
            </button>
            {detailsModalService.imageUrl && (
              <div className="w-full h-72 bg-zinc-950 relative">
                <img src={detailsModalService.imageUrl} alt={detailsModalService.name} className="w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
              </div>
            )}
            <div className="p-8 md:p-12 space-y-8">
              <div className="text-center">
                {detailsModalService.category && (
                  <span className="inline-block mb-4 text-xs font-serif tracking-widest text-primary uppercase">{detailsModalService.category}</span>
                )}
                <h3 className="text-3xl font-serif text-zinc-100 uppercase tracking-widest leading-tight">{detailsModalService.name}</h3>
                <div className="w-12 h-px bg-primary mx-auto mt-6"></div>
              </div>
              
              {detailsModalService.description ? (
                <div className="text-zinc-400 leading-loose text-center font-light whitespace-pre-wrap text-sm md:text-base">
                  {detailsModalService.description}
                </div>
              ) : (
                <p className="text-zinc-600 text-sm italic text-center font-serif">{t("home.noDescription")}</p>
              )}

              <div className="border-t border-zinc-800 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="w-full sm:w-auto text-center sm:text-left">
                  <p className="text-xs font-light text-zinc-500 uppercase tracking-widest mb-2">{t("home.durationAndPrice")}</p>
                  <p className="text-sm font-light tracking-widest text-zinc-300">{detailsModalService.duration} <span className="mx-2 text-zinc-700">|</span> <span className="text-primary text-2xl font-serif">${detailsModalService.priceUSD} <span className="text-sm opacity-70 ml-2 font-bold whitespace-nowrap">/ {detailsModalService.priceHTG.toLocaleString()} HTG</span></span></p>
                </div>
                <div className="flex w-full sm:w-auto gap-4 flex-col sm:flex-row">
                  {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 text-zinc-300 px-6 py-4 font-serif uppercase tracking-widest text-xs hover:border-zinc-600 transition-all whitespace-nowrap">
                      <MessageCircle size={16} /> {t("home.inquire")}
                    </a>
                  )}
                  <Link href={`/book?service=${detailsModalService.id}`} 
                    className="flex-1 sm:flex-none flex items-center justify-center bg-primary text-primary-foreground px-10 py-4 font-serif uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(var(--primary),0.2)] hover:shadow-[0_0_25px_rgba(var(--primary),0.4)] transition-all">
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
