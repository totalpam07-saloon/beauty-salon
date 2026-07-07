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

export default function TemplateClassic({ services, settings, portfolio, reviews = [], tenantDomain, onOpenFeed }: ClientHomeProps) {
  const { t } = useI18n();
  const [detailsModalService, setDetailsModalService] = useState<Service | null>(null);
  const [fullScreenMedia, setFullScreenMedia] = useState<{url: string, type: 'image'|'video'} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categories = ["Tous", ...new Set(services.map(s => s.category).filter(Boolean))] as string[];
  const filteredServices = selectedCategory === "Tous" ? services : services.filter(s => s.category === selectedCategory);

  return (
    <div className="flex-1 w-full bg-background transition-colors duration-300">
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

        <h1 className={`relative z-10 text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-sm ${settings.bannerUrl ? "text-white" : "text-foreground"}`}>
          {t("home.title")}
        </h1>
        <p className={`relative z-10 text-lg md:text-xl max-w-lg mb-8 ${settings.bannerUrl ? "text-white/90" : "text-foreground/80"}`}>
          {t("home.subtitle")}
        </p>
        <Link href="/book" className="relative z-10 flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300">
          <Calendar size={20} />
          {t("home.bookNow")}
        </Link>
      </section>

      {/* Services Section */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <h2 className="text-3xl font-extrabold text-foreground mb-8 flex items-center gap-3">
          <Sparkles className="text-primary w-8 h-8" />
          {t("home.services")}
        </h2>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredServices.map((service, i) => (
            <div
              key={service.id}
              className="bg-card border border-border rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Service image */}
              <div className="w-full h-44 bg-secondary/30 flex items-center justify-center overflow-hidden relative">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-foreground/20">
                    <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                      <div className="group-hover:text-primary-foreground transition-colors duration-300">
                        {icons[i % icons.length]}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{service.name}</h3>
                  <p className="text-foreground/60 font-medium text-sm">{service.duration}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-primary">${service.priceUSD}</span>
                    <span className="text-sm font-bold text-foreground/50">{service.priceHTG.toLocaleString()} HTG</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setDetailsModalService(service)} className="text-xs font-bold bg-secondary hover:bg-secondary/80 text-foreground/80 px-4 py-2 rounded-full transition-colors">
                      {t("home.details")}
                    </button>
                    <Link href={`/book?service=${service.id}`} className="text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-full transition-colors">
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
        <section className="w-full bg-secondary/20 border-t border-border py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground flex items-center gap-3">
                <Images className="text-primary w-7 h-7" />
                {t("home.portfolioPreview")}
              </h2>
              <Link href="/portfolio"
                className="flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
                {t("home.seeAll")} <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {portfolio.slice(0, 6).map((photo) => (
                <Link key={photo.id} href="/portfolio"
                  className="aspect-square rounded-2xl overflow-hidden block group shadow-sm hover:shadow-lg transition-all duration-300">
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
        <section className="w-full bg-background border-t border-border py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-foreground mb-8 flex items-center justify-center gap-3 text-center">
              <Star className="text-yellow-400 w-8 h-8 fill-yellow-400" />
              {t("home.reviewsTitle")}
            </h2>
            <div className="flex items-start overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory">
              {reviews.map((review) => (
                <div key={review.id} className="min-w-[300px] max-w-[350px] bg-card border border-border rounded-3xl p-6 shadow-sm snap-center shrink-0">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={18} className={review.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-foreground/20"} />
                    ))}
                  </div>
                  <p className="text-foreground/80 font-medium italic mb-6 line-clamp-4">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setDetailsModalService(null)}>
          <div className="bg-card rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setDetailsModalService(null)} className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors z-10">
              <X size={20} />
            </button>
            {detailsModalService.imageUrl && (
              <div className="w-full h-64 bg-secondary">
                <img src={detailsModalService.imageUrl} alt={detailsModalService.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-black text-foreground leading-tight">{detailsModalService.name}</h3>
                {detailsModalService.category && (
                  <span className="inline-block mt-3 text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">{detailsModalService.category}</span>
                )}
              </div>
              
              {detailsModalService.description ? (
                <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap text-sm font-medium">
                  {detailsModalService.description}
                </div>
              ) : (
                <p className="text-foreground/50 text-sm italic">{t("home.noDescription")}</p>
              )}

              <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                  <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">{t("home.durationAndPrice")}</p>
                  <p className="text-sm font-extrabold text-foreground">{detailsModalService.duration} • <span className="text-primary text-xl">${detailsModalService.priceUSD}</span></p>
                </div>
                <div className="flex w-full sm:w-auto gap-3">
                  {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] px-4 py-3 rounded-2xl font-bold shadow-sm hover:bg-[#25D366]/20 transition-all whitespace-nowrap">
                      <MessageCircle size={18} /> {t("home.inquire")}
                    </a>
                  )}
                  <Link href={`/book?service=${detailsModalService.id}`} 
                    className="flex-1 sm:flex-none flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold shadow-lg hover:opacity-90 hover:scale-105 transition-all">
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
