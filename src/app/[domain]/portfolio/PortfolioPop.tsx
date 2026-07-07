import { Images, X, ExternalLink, Calendar, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Service, SalonSettings, PortfolioPhoto } from "@/store/salon";
import { usePortfolio } from "./usePortfolio";

export function PortfolioPop({
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
    <div className="flex-1 w-full bg-[#FAFAFA] text-black font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white">
      

      {/* Page Header */}
      <section className="relative w-full py-24 flex flex-col items-center text-center px-4 overflow-hidden">
        <h1 className="text-5xl md:text-7xl font-black text-black mb-6 uppercase inline-block bg-[#FFE5E5] border-4 border-black px-8 py-4 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1">
          {t("portfolio.title")}
        </h1>
        <p className="text-black/80 text-xl font-bold max-w-lg mb-10 border-2 border-black bg-white px-6 py-3 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] rotate-1">
          {t("portfolio.subtitle")}
        </p>
        <Link href="/book" className="flex items-center gap-3 bg-primary text-primary-foreground border-4 border-black px-8 py-5 rounded-full font-black uppercase text-lg shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)] transition-all duration-300">
          <Calendar size={24} strokeWidth={3} /> {t("home.bookNow")}
        </Link>
      </section>

      {/* Filter Bar */}
      {categories.length > 1 && (
        <div className="max-w-7xl mx-auto px-6 mb-12 overflow-x-auto w-full">
          <div className="flex gap-4 pb-4 justify-center min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-3 rounded-xl font-black text-sm uppercase transition-all duration-300 border-4 border-black ${
                  activeFilter === cat
                    ? "bg-black text-white shadow-[4px_4px_0_0_rgba(255,138,91,1)] -translate-y-1"
                    : "bg-white text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]"
                }`}
              >
                {cat === "all" ? t("portfolio.all") : cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24 w-full flex-1">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-black/50 font-black">
            <Images className="w-24 h-24 mx-auto mb-6 opacity-30" strokeWidth={2} />
            <p className="text-2xl uppercase">{t("portfolio.empty")}</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelected(photo.id)}
                className="break-inside-avoid mb-6 rounded-2xl overflow-hidden cursor-pointer group relative bg-white border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[10px_10px_0_0_rgba(0,0,0,1)] transition-all duration-300"
              >
                <div className="border-b-4 border-black p-2 bg-[#F0F0F0]">
                   <Image
                    src={((photo as any).image_url || photo.imageUrl || "/placeholder.png")}
                    alt={photo.caption || photo.category}
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, 33vw"
                    style={{ width: '100%', height: 'auto' }}
                    className="group-hover:scale-105 transition-transform duration-500 rounded-lg border-2 border-black"
                  />
                </div>
                <div className="p-4 bg-white flex flex-col">
                  <span className="text-black font-black text-sm uppercase bg-[#FFE5E5] border-2 border-black px-2 py-1 rounded-md inline-block w-fit mb-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">{photo.category}</span>
                  {photo.caption && <p className="text-black/80 font-bold text-sm line-clamp-2 mt-1">{photo.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selected && selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-[2rem] border-4 border-black w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[50vh] md:h-[65vh] bg-[#F0F0F0] border-b-4 border-black p-4">
              <div className="w-full h-full relative rounded-[1rem] overflow-hidden border-4 border-black bg-white">
                <Image src={((selectedPhoto as any).image_url || selectedPhoto.imageUrl || "/placeholder.png")} alt={selectedPhoto.caption || ""} fill sizes="(max-width: 1024px) 100vw, 1000px" className="object-contain" />
              </div>
              <button onClick={() => setSelected(null)} className="absolute top-6 right-6 bg-white border-4 border-black text-black p-2 rounded-full hover:bg-primary transition-colors z-10 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <X size={24} strokeWidth={3} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white">
              <div className="space-y-4 max-w-xl">
                <span className="text-black font-black text-xs uppercase bg-[#E5FBE5] border-2 border-black px-3 py-1.5 rounded-lg shadow-[2px_2px_0_0_rgba(0,0,0,1)] inline-block rotate-1">{selectedPhoto.category}</span>
                {selectedPhoto.caption && <p className="text-black font-bold text-base leading-relaxed bg-gray-50 border-4 border-black p-4 rounded-xl">{selectedPhoto.caption}</p>}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
                {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                  <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-[#25D366] text-black border-4 border-black px-6 py-4 rounded-xl font-black uppercase text-sm shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-transform">
                    <MessageCircle size={20} strokeWidth={3} /> {t("portfolio.inquire")}
                  </a>
                )}
                {selectedPhoto.instagramUrl && (
                  <a href={selectedPhoto.instagramUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-[#FFE5E5] text-black border-4 border-black px-6 py-4 rounded-xl font-black uppercase text-sm shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-transform">
                    <ExternalLink size={20} strokeWidth={3} /> {t("portfolio.viewOnIG")}
                  </a>
                )}
                {relatedService && (
                  <Link href={`/book?service=${relatedService.id}`}
                    className="flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-xl font-black uppercase text-sm shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-4 border-black hover:text-primary hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all">
                    <Calendar size={20} strokeWidth={3} /> {t("portfolio.bookThis")}
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
