"use client";

import { ClientHomeProps } from "../ClientHome";
import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";
import { 
  Calendar, MapPin, Phone, 
  ChevronRight, Star, Images, X, Play, MessageCircle, Sparkles, Heart
} from "lucide-react";

export default function TemplatePlayful({ services, settings, portfolio, reviews, onOpenFeed }: ClientHomeProps) {
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
    <Sparkles size={24} />,
    <Heart size={24} />,
    <Star size={24} />
  ];

  return (
    <div className="min-h-screen bg-[#F0F5FF] overflow-x-hidden font-sans relative selection:bg-primary selection:text-white">
      
      {/* Background Animated Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-32 px-4 max-w-5xl mx-auto text-center flex flex-col items-center justify-center min-h-[70vh]">
        <div className="glass-card rounded-[3rem] p-10 md:p-16 w-full flex flex-col items-center transform transition-transform hover:scale-[1.01] duration-500">
          {settings?.bannerUrl ? (
            <div className="w-full h-48 md:h-64 mb-10 rounded-3xl overflow-hidden shadow-lg relative border-4 border-white/50">
              <img src={settings.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gradient-to-tr from-primary to-pink-400 text-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-primary/30 rotate-12">
              <Sparkles size={40} className="fill-white/20" />
            </div>
          )}
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 tracking-tight mb-6 leading-tight">
            {t("home.title")}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl font-medium leading-relaxed">
            {t("home.subtitle")}
          </p>

          <Link href="/book" className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-500 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
            <Calendar size={20} className="group-hover:animate-bounce" />
            {t("home.bookNow")}
            <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="bg-white/60 backdrop-blur-md text-primary font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider shadow-sm mb-4 inline-block">
            {t("home.services")}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800">
            {t("home.spaServicesTitle")}
          </h2>
        </div>

        {categories.length > 1 && (
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-3 justify-center no-scrollbar mb-8">
            {categories.map((c) => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={`whitespace-nowrap px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm ${selectedCategory === c ? "bg-primary text-white shadow-primary/30 shadow-lg scale-105" : "glass-card text-slate-600 hover:bg-white hover:text-slate-800"}`}>
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredServices.map((service, i) => (
            <div
              key={service.id}
              className="glass-card rounded-[2rem] p-4 flex flex-col group hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              onClick={() => setDetailsModalService(service)}
            >
              {/* Service image */}
              <div className="w-full h-48 bg-slate-100 rounded-3xl flex items-center justify-center overflow-hidden mb-5 relative">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-slate-300 group-hover:text-primary transition-colors duration-300">
                    {icons[i % icons.length]}
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-slate-800 font-bold px-3 py-1 rounded-full text-xs shadow-sm">
                  {service.duration}
                </div>
              </div>

              <div className="px-2 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-1 leading-tight group-hover:text-primary transition-colors">{service.name}</h3>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-slate-800">${service.priceUSD}</span>
                    <span className="text-xs font-bold text-slate-500">{service.priceHTG.toLocaleString()} HTG</span>
                  </div>
                  <Link 
                    href={`/book?service=${service.id}`} 
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-100 hover:bg-primary hover:text-white text-slate-800 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
                  >
                    <ChevronRight size={20} className="ml-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Preview Strip */}
      {portfolio.length > 0 && (
        <section className="relative z-10 w-full py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="bg-white/60 backdrop-blur-md text-primary font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider shadow-sm mb-4 inline-block">
                  {t("home.portfolioPreview")}
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800">
                  {t("home.spaPortfolioTitle")}
                </h2>
              </div>
              <Link href="/portfolio"
                className="hidden md:flex items-center gap-2 glass-card px-6 py-3 rounded-full font-bold text-slate-700 hover:bg-white transition-all shadow-sm">
                {t("home.seeAll")} <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {portfolio.slice(0, 4).map((photo) => (
                <Link key={photo.id} href="/portfolio"
                  className="aspect-[4/5] rounded-[2rem] overflow-hidden block group glass-card p-2 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <img
                    src={photo.imageUrl}
                    alt={photo.category}
                    className="w-full h-full object-cover rounded-[1.5rem] group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
              ))}
            </div>
            <div className="mt-8 flex justify-center md:hidden">
              <Link href="/portfolio"
                className="flex items-center gap-2 glass-card px-8 py-3 rounded-full font-bold text-slate-700 hover:bg-white transition-all shadow-sm">
                {t("home.seeAll")} <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      {reviews && reviews.length > 0 && (
        <section className="relative z-10 w-full py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="bg-white/60 backdrop-blur-md text-yellow-500 font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider shadow-sm mb-4 inline-flex items-center gap-2">
                <Star size={14} className="fill-yellow-500" /> {t("home.reviewsTitle")}
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800">
                {t("home.spaReviewsTitle")}
              </h2>
            </div>
            <div className="flex items-start overflow-x-auto gap-6 pb-12 no-scrollbar snap-x snap-mandatory px-4 md:px-0">
              {reviews.map((review) => (
                <div key={review.id} className="min-w-[300px] max-w-[360px] glass-card rounded-[2.5rem] p-8 shadow-lg snap-center shrink-0">
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={20} className={review.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-200"} />
                    ))}
                  </div>
                  <p className="text-slate-700 font-medium text-lg leading-relaxed mb-8">
                    "{review.comment}"
                  </p>
                  
                  {/* Media Attachment */}
                  {review.media && review.media.length > 0 ? (
                    <div 
                      className="mb-8 rounded-3xl overflow-hidden shadow-sm aspect-square bg-black relative cursor-pointer group"
                      onClick={() => onOpenFeed && onOpenFeed(review.id)}
                    >
                      {review.media[0].type === 'video' ? (
                        <>
                          <video 
                            src={review.media[0].url} 
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-70 transition-opacity"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 text-white shadow-xl">
                              <Play fill="currentColor" size={24} className="ml-1" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <img 
                          src={review.media[0].url} 
                          alt="Review media" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                    </div>
                  ) : null}

                  <div className="flex items-center gap-4 bg-white/50 rounded-full p-2 pr-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-primary to-purple-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {review.isAnonymous ? "?" : review.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">
                        {review.isAnonymous ? t("home.anonymous") : review.clientName}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">{review.serviceName}</p>
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setDetailsModalService(null)}>
          <div className="glass-card bg-white/90 rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setDetailsModalService(null)} className="absolute top-6 right-6 bg-white text-slate-800 rounded-full p-3 hover:bg-slate-100 transition-colors z-10 shadow-md">
              <X size={20} strokeWidth={3} />
            </button>
            {detailsModalService.imageUrl && (
              <div className="w-full h-64 p-3 pb-0">
                <img src={detailsModalService.imageUrl} alt={detailsModalService.name} className="w-full h-full object-cover rounded-[2.5rem]" />
              </div>
            )}
            <div className="p-8 md:p-12 space-y-6">
              <div className="text-center">
                {detailsModalService.category && (
                  <span className="inline-block mb-4 text-xs font-bold bg-primary/10 text-primary px-4 py-1.5 rounded-full uppercase tracking-wider">{detailsModalService.category}</span>
                )}
                <h3 className="text-3xl font-extrabold text-slate-800">{detailsModalService.name}</h3>
              </div>
              
              {detailsModalService.description ? (
                <div className="text-slate-600 leading-relaxed text-center font-medium">
                  {detailsModalService.description}
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic text-center">{t("home.noDescription")}</p>
              )}

              <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t("home.durationAndPrice")}</p>
                  <p className="text-xl font-black text-slate-800 flex items-center gap-2">
                    ${detailsModalService.priceUSD} 
                    <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm">
                      {detailsModalService.duration}
                    </span>
                  </p>
                </div>
                <div className="flex w-full sm:w-auto gap-3 flex-col sm:flex-row">
                  {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-[#25D366] px-6 py-4 rounded-full font-bold shadow-sm hover:shadow-md transition-all whitespace-nowrap">
                      <MessageCircle size={20} /> {t("home.inquire")}
                    </a>
                  )}
                  <Link href={`/book?service=${detailsModalService.id}`} 
                    className="flex-1 sm:flex-none flex items-center justify-center bg-primary text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all">
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
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setFullScreenMedia(null)}
        >
          <button 
            onClick={() => setFullScreenMedia(null)} 
            className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/20 text-white rounded-full p-4 hover:bg-white/30 transition-colors z-10 backdrop-blur-md"
          >
            <X size={24} />
          </button>
          
          <div 
            className="w-full max-w-5xl max-h-[90vh] flex items-center justify-center relative rounded-[3rem] overflow-hidden shadow-2xl"
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
