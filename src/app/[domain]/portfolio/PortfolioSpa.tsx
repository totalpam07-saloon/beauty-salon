import { Images, X, ExternalLink, Calendar, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Service, SalonSettings, PortfolioPhoto } from "@/store/salon";
import { usePortfolio } from "./usePortfolio";

export function PortfolioSpa({
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
    <div className="flex-1 w-full bg-[#F9F6F0] text-[#5C5447] font-sans min-h-screen flex flex-col">
      

      {/* Page Header */}
      <section className="relative w-full py-20 flex flex-col items-center text-center px-4 overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-light text-[#3D372F] mb-6 tracking-wide">
          {t("portfolio.title")}
        </h1>
        <p className="text-[#7A7265] text-lg font-light max-w-lg mb-10 leading-relaxed">
          {t("portfolio.subtitle")}
        </p>
        <Link href="/book" className="flex items-center gap-3 bg-[#3D372F] text-white px-8 py-4 rounded-full font-light tracking-wide hover:bg-black transition-all duration-500 shadow-md">
          <Calendar size={18} strokeWidth={1.5} /> {t("home.bookNow")}
        </Link>
      </section>

      {/* Filter Bar */}
      {categories.length > 1 && (
        <div className="max-w-5xl mx-auto px-6 mb-12 overflow-x-auto w-full">
          <div className="flex gap-3 pb-2 justify-center min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-3 rounded-full font-light text-sm whitespace-nowrap transition-all duration-300 ${
                  activeFilter === cat
                    ? "bg-[#3D372F] text-white shadow-md"
                    : "bg-white text-[#7A7265] border border-[#E5DFD3] hover:border-[#3D372F]/30"
                }`}
              >
                {cat === "all" ? t("portfolio.all") : cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-6 pb-24 w-full flex-1">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-[#7A7265]/50 font-light">
            <Images className="w-16 h-16 mx-auto mb-6 opacity-30" strokeWidth={1} />
            <p className="text-lg">{t("portfolio.empty")}</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 gap-6">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelected(photo.id)}
                className="break-inside-avoid mb-6 rounded-3xl overflow-hidden cursor-pointer group relative shadow-sm hover:shadow-xl transition-all duration-500 bg-white"
              >
                <Image
                  src={((photo as any).image_url || photo.imageUrl || "/placeholder.png")}
                  alt={photo.caption || photo.category}
                  width={0}
                  height={0}
                  sizes="(max-width: 640px) 100vw, 33vw"
                  style={{ width: '100%', height: 'auto' }}
                  className="group-hover:scale-105 opacity-95 group-hover:opacity-100 transition-all duration-700 ease-in-out"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/80 backdrop-blur-[2px] transition-all duration-500 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 text-center">
                  <span className="text-[#3D372F] font-medium text-sm tracking-widest uppercase mb-3 border-b border-[#3D372F]/20 pb-2">{photo.category}</span>
                  {photo.caption && <p className="text-[#7A7265] text-sm font-light leading-relaxed">{photo.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selected && selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-[#3D372F]/40 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[50vh] md:h-[65vh] bg-[#F9F6F0]">
              <Image src={((selectedPhoto as any).image_url || selectedPhoto.imageUrl || "/placeholder.png")} alt={selectedPhoto.caption || ""} fill sizes="(max-width: 1024px) 100vw, 1000px" className="object-contain" />
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 bg-white/80 text-[#3D372F] p-3 rounded-full hover:bg-[#F9F6F0] transition-colors z-10">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white">
              <div className="space-y-3">
                <span className="text-primary font-light text-xs uppercase tracking-widest border border-primary/20 px-3 py-1.5 rounded-full">{selectedPhoto.category}</span>
                {selectedPhoto.caption && <p className="text-[#7A7265] font-light text-sm leading-relaxed max-w-md">{selectedPhoto.caption}</p>}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
                {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                  <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 border border-[#E5DFD3] text-[#7A7265] px-6 py-4 rounded-full font-light text-sm hover:bg-[#F9F6F0] hover:text-[#3D372F] transition-all">
                    <MessageCircle size={18} strokeWidth={1.5} /> {t("portfolio.inquire")}
                  </a>
                )}
                {selectedPhoto.instagramUrl && (
                  <a href={selectedPhoto.instagramUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 border border-[#E5DFD3] text-[#7A7265] px-6 py-4 rounded-full font-light text-sm hover:bg-[#F9F6F0] hover:text-[#3D372F] transition-all">
                    <ExternalLink size={18} strokeWidth={1.5} /> {t("portfolio.viewOnIG")}
                  </a>
                )}
                {relatedService && (
                  <Link href={`/book?service=${relatedService.id}`}
                    className="flex items-center justify-center gap-3 bg-[#3D372F] text-white px-8 py-4 rounded-full font-light tracking-wide text-sm hover:bg-black transition-all">
                    <Calendar size={18} strokeWidth={1.5} /> {t("portfolio.bookThis")}
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
