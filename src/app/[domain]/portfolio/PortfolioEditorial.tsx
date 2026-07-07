import { Images, X, ExternalLink, Calendar, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Service, SalonSettings, PortfolioPhoto } from "@/store/salon";
import { usePortfolio } from "./usePortfolio";

export function PortfolioEditorial({
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
    <div className="flex-1 w-full bg-white text-black font-sans min-h-screen flex flex-col selection:bg-black selection:text-white">
      

      {/* Page Header */}
      <section className="relative w-full py-32 flex flex-col items-center text-center px-4 overflow-hidden">
        <h1 className="text-5xl md:text-7xl font-serif text-black mb-8 tracking-tighter uppercase">
          {t("portfolio.title")}
        </h1>
        <div className="w-24 h-[1px] bg-black mb-8"></div>
        <p className="text-black/60 text-sm font-light uppercase tracking-widest max-w-xl mb-12 leading-relaxed">
          {t("portfolio.subtitle")}
        </p>
        <Link href="/book" className="flex items-center gap-3 border border-black text-black px-12 py-5 font-serif uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-all duration-500">
          {t("home.bookNow")}
        </Link>
      </section>

      {/* Filter Bar */}
      {categories.length > 1 && (
        <div className="max-w-[1400px] mx-auto px-6 mb-16 overflow-x-auto w-full">
          <div className="flex gap-12 pb-4 justify-center min-w-max border-b border-black/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`pb-4 text-xs font-serif uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 relative ${
                  activeFilter === cat
                    ? "text-black"
                    : "text-black/30 hover:text-black/70"
                }`}
              >
                {cat === "all" ? t("portfolio.all") : cat}
                {activeFilter === cat && (
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-[1400px] mx-auto px-6 pb-32 w-full flex-1">
        {filtered.length === 0 ? (
          <div className="text-center py-32 text-black/20 font-light">
            <Images className="w-16 h-16 mx-auto mb-6 opacity-30" strokeWidth={1} />
            <p className="tracking-widest uppercase text-sm font-serif">{t("portfolio.empty")}</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-8">
            {filtered.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setSelected(photo.id)}
                className="break-inside-avoid mb-8 cursor-pointer group relative bg-zinc-50 border border-transparent hover:border-black/10 transition-all duration-500 p-2"
              >
                <div className="relative overflow-hidden bg-zinc-100">
                  <Image
                    src={((photo as any).image_url || photo.imageUrl || "/placeholder.png")}
                    alt={photo.caption || photo.category}
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, 33vw"
                    style={{ width: '100%', height: 'auto' }}
                    className="group-hover:scale-105 transition-transform duration-1000 ease-in-out grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute top-4 left-4 bg-white text-black text-xs font-serif px-2 py-1 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    No. {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <div className="py-4 bg-transparent flex flex-col items-center text-center">
                  <span className="text-black/50 font-sans text-[10px] uppercase tracking-[0.3em] mb-2">{photo.category}</span>
                  {photo.caption && <p className="text-black/80 text-xs font-serif line-clamp-2">{photo.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selected && selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-500"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white border border-black w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 bg-white border border-black text-black p-3 hover:bg-black hover:text-white transition-colors z-20">
              <X size={20} strokeWidth={1} />
            </button>
            <div className="relative w-full md:w-3/5 h-[40vh] md:h-[80vh] bg-zinc-100 shrink-0">
              <Image src={((selectedPhoto as any).image_url || selectedPhoto.imageUrl || "/placeholder.png")} alt={selectedPhoto.caption || ""} fill sizes="(max-width: 1024px) 100vw, 1000px" className="object-cover grayscale" />
            </div>
            
            <div className="p-8 md:p-16 flex-1 flex flex-col justify-center overflow-y-auto">
              <div className="space-y-6 mb-12">
                <span className="text-black/40 font-sans text-[10px] uppercase tracking-[0.3em]">{selectedPhoto.category}</span>
                <div className="w-12 h-[1px] bg-black/20"></div>
                {selectedPhoto.caption ? (
                  <p className="text-black/80 font-serif text-lg leading-relaxed">{selectedPhoto.caption}</p>
                ) : (
                  <p className="text-black/30 font-serif italic">Aucune description disponible.</p>
                )}
              </div>
              
              <div className="flex flex-col gap-4 w-full mt-auto">
                {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                  <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 border border-black/20 text-black/60 px-8 py-5 font-serif uppercase tracking-widest text-sm hover:border-black hover:text-black transition-all">
                    <MessageCircle size={18} strokeWidth={1} /> {t("portfolio.inquire")}
                  </a>
                )}
                {selectedPhoto.instagramUrl && (
                  <a href={selectedPhoto.instagramUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 border border-black/20 text-black/60 px-8 py-5 font-serif uppercase tracking-widest text-sm hover:border-black hover:text-black transition-all">
                    <ExternalLink size={18} strokeWidth={1} /> {t("portfolio.viewOnIG")}
                  </a>
                )}
                {relatedService && (
                  <Link href={`/book?service=${relatedService.id}`}
                    className="flex items-center justify-center gap-3 bg-black text-white px-8 py-5 font-serif uppercase tracking-widest text-sm hover:bg-white hover:text-black border border-black transition-all">
                    <Calendar size={18} strokeWidth={1} /> {t("portfolio.bookThis")}
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
