import { Images, X, ExternalLink, Calendar, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Service, SalonSettings, PortfolioPhoto } from "@/store/salon";
import { usePortfolio } from "./usePortfolio";

export function PortfolioLuxe({
  services,
  settings,
  portfolio,
  flow
}: {
  services: Service[];
  settings: SalonSettings;
  portfolio: PortfolioPhoto[];
  flow: ReturnType<typeof usePortfolio>;
}) {
  const {
    t,
    activeFilter,
    setActiveFilter,
    selected,
    setSelected,
    categories,
    filtered,
    selectedPhoto,
    relatedService
  } = flow;

  return (
    <div className="flex-1 w-full bg-[#1A1A1A] text-white font-sans min-h-screen flex flex-col selection:bg-[#D4AF37] selection:text-[#1A1A1A]">
      

      {/* Page Header */}
      <section className="relative w-full py-20 flex flex-col items-center text-center px-4 overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4 tracking-widest uppercase">
          {t("portfolio.title")}
        </h1>
        <div className="w-16 h-px bg-white/20 mb-6"></div>
        <p className="text-white/60 text-sm font-light uppercase tracking-widest max-w-lg mb-10 leading-relaxed">
          {t("portfolio.subtitle")}
        </p>
        <Link href="/book" className="flex items-center gap-3 bg-[#D4AF37] text-[#1A1A1A] px-8 py-4 font-serif uppercase tracking-[0.2em] text-sm hover:bg-white transition-all duration-500">
          <Calendar size={16} /> {t("home.bookNow")}
        </Link>
      </section>

      {/* Filter Bar */}
      {categories.length > 1 && (
        <div className="max-w-6xl mx-auto px-6 mb-12 overflow-x-auto w-full">
          <div className="flex gap-4 pb-2 justify-center min-w-max border-b border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`pb-4 px-2 text-xs font-light uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 relative ${
                  activeFilter === cat
                    ? "text-[#D4AF37]"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {cat === "all" ? t("portfolio.all") : cat}
                {activeFilter === cat && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-[#D4AF37]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24 w-full flex-1">
        {filtered.length === 0 ? (
          <div className="text-center py-32 text-white/20 font-light">
            <Images className="w-16 h-16 mx-auto mb-6 opacity-30" strokeWidth={1} />
            <p className="tracking-widest uppercase text-sm">{t("portfolio.empty")}</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 md:columns-4 gap-6">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelected(photo.id)}
                className="break-inside-avoid mb-6 cursor-pointer group relative overflow-hidden bg-[#141414] border border-white/5"
              >
                <Image
                  src={((photo as any).image_url || photo.imageUrl || "/placeholder.png")}
                  alt={photo.caption || photo.category}
                  width={0}
                  height={0}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  style={{ width: '100%', height: 'auto' }}
                  className="group-hover:scale-110 group-hover:opacity-60 transition-all duration-700 ease-in-out"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-[#D4AF37] font-light text-[10px] uppercase tracking-[0.3em] mb-2">{photo.category}</span>
                  {photo.caption && <p className="text-white/80 text-xs font-light text-center line-clamp-2 italic">{photo.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selected && selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#141414] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[50vh] md:h-[65vh] bg-black">
              <Image src={((selectedPhoto as any).image_url || selectedPhoto.imageUrl || "/placeholder.png")} alt={selectedPhoto.caption || ""} fill sizes="(max-width: 1024px) 100vw, 1000px" className="object-contain" />
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 bg-black/50 text-white p-3 hover:text-[#D4AF37] hover:bg-black transition-colors z-10 border border-white/10">
                <X size={20} strokeWidth={1} />
              </button>
            </div>
            
            <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#141414]">
              <div className="space-y-3">
                <span className="text-[#D4AF37] font-light text-xs uppercase tracking-[0.3em]">{selectedPhoto.category}</span>
                {selectedPhoto.caption && <p className="text-white/80 font-light text-sm italic">{selectedPhoto.caption}</p>}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
                {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                  <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 border border-white/20 text-white/80 px-6 py-3 font-light text-xs uppercase tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all">
                    <MessageCircle size={16} strokeWidth={1.5} /> {t("portfolio.inquire")}
                  </a>
                )}
                {selectedPhoto.instagramUrl && (
                  <a href={selectedPhoto.instagramUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 border border-white/20 text-white/80 px-6 py-3 font-light text-xs uppercase tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all">
                    <ExternalLink size={16} strokeWidth={1.5} /> {t("portfolio.viewOnIG")}
                  </a>
                )}
                {relatedService && (
                  <Link href={`/book?service=${relatedService.id}`}
                    className="flex items-center justify-center gap-3 bg-[#D4AF37] text-[#1A1A1A] px-8 py-3 font-serif uppercase tracking-[0.2em] text-xs hover:bg-white transition-all">
                    <Calendar size={16} strokeWidth={1.5} /> {t("portfolio.bookThis")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
