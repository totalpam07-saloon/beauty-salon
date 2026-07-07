import { Images, X, ExternalLink, Calendar, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Service, SalonSettings, PortfolioPhoto } from "@/store/salon";
import { usePortfolio } from "./usePortfolio";

export function PortfolioRetro({
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
    <div className="flex-1 w-full bg-[#F4EBD9] text-[#3D405B] font-serif min-h-screen flex flex-col selection:bg-[#E07A5F] selection:text-[#F4EBD9]">
      

      {/* Page Header */}
      <section className="relative w-full py-20 flex flex-col items-center text-center px-4 overflow-hidden">
        <h1 className="text-5xl md:text-7xl font-black text-[#E07A5F] mb-6 tracking-tight drop-shadow-[3px_3px_0_#3D405B] -rotate-2">
          {t("portfolio.title")}
        </h1>
        <p className="text-[#3D405B] text-xl font-bold max-w-lg mb-12 bg-[#81B29A] px-6 py-3 rounded-lg border-[4px] border-[#3D405B] shadow-[4px_4px_0_0_#3D405B] rotate-1">
          {t("portfolio.subtitle")}
        </p>
        <Link href="/book" className="flex items-center gap-3 bg-[#F2CC8F] text-[#3D405B] border-[4px] border-[#3D405B] px-10 py-5 rounded-full font-black uppercase tracking-widest shadow-[6px_6px_0_0_#3D405B] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#3D405B] active:translate-y-1 active:shadow-[2px_2px_0_0_#3D405B] transition-all duration-200">
          <Calendar size={22} strokeWidth={3} /> {t("home.bookNow")}
        </Link>
      </section>

      {/* Filter Bar */}
      {categories.length > 1 && (
        <div className="max-w-6xl mx-auto px-6 mb-16 overflow-x-auto w-full">
          <div className="flex gap-4 pb-4 justify-center min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-200 border-[3px] border-[#3D405B] ${
                  activeFilter === cat
                    ? "bg-[#E07A5F] text-[#F4EBD9] shadow-[4px_4px_0_0_#3D405B] -translate-y-1"
                    : "bg-[#F4EBD9] text-[#3D405B] shadow-[2px_2px_0_0_#3D405B] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#3D405B]"
                }`}
              >
                {cat === "all" ? t("portfolio.all") : cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-32 w-full flex-1">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-[#3D405B]/50 font-bold">
            <Images className="w-20 h-20 mx-auto mb-6 opacity-40" strokeWidth={2} />
            <p className="text-2xl uppercase tracking-widest">{t("portfolio.empty")}</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelected(photo.id)}
                className="break-inside-avoid mb-10 cursor-pointer group relative bg-white p-4 pb-12 border-[4px] border-[#3D405B] shadow-[8px_8px_0_0_#3D405B] hover:-translate-y-2 hover:-rotate-2 hover:shadow-[12px_12px_0_0_#3D405B] transition-all duration-300"
              >
                <div className="w-full relative overflow-hidden bg-[#F4EBD9] border-2 border-[#3D405B] shadow-inner mb-4">
                  <Image
                    src={((photo as any).image_url || photo.imageUrl || "/placeholder.png")}
                    alt={photo.caption || photo.category}
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, 33vw"
                    style={{ width: '100%', height: 'auto' }}
                    className="sepia-[.3] group-hover:sepia-0 transition-all duration-500"
                  />
                </div>
                <div className="absolute bottom-3 left-0 w-full text-center px-4 flex flex-col items-center">
                  <span className="font-['Caveat',cursive,serif] text-[#E07A5F] text-xl font-bold -rotate-3">{photo.category}</span>
                  {photo.caption && <p className="text-[#3D405B] font-['Caveat',cursive,serif] text-lg leading-tight line-clamp-1 rotate-2 opacity-80">{photo.caption}</p>}
                </div>
                {/* Vintage Tape effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 backdrop-blur-sm rotate-2 shadow-sm border border-black/5 opacity-80 z-10" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selected && selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-[#3D405B]/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#F4EBD9] border-[6px] border-[#3D405B] rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col md:flex-row shadow-[16px_16px_0_0_#E07A5F] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 bg-[#E07A5F] border-[4px] border-[#3D405B] text-[#F4EBD9] p-2 rounded-full hover:bg-[#F2CC8F] hover:text-[#3D405B] transition-colors z-20 shadow-[4px_4px_0_0_#3D405B]">
              <X size={24} strokeWidth={3} />
            </button>
            <div className="relative w-full md:w-3/5 h-[45vh] md:h-[80vh] bg-[#3D405B] border-b-[6px] md:border-b-0 md:border-r-[6px] border-[#3D405B] p-4 flex items-center justify-center">
               <div className="w-full h-full relative bg-white p-4 pb-16 border-[4px] border-[#3D405B] shadow-inner rotate-1 max-w-[90%] max-h-[90%]">
                 <div className="w-full h-full relative overflow-hidden bg-black/5">
                   <Image src={((selectedPhoto as any).image_url || selectedPhoto.imageUrl || "/placeholder.png")} alt={selectedPhoto.caption || ""} fill sizes="(max-width: 1024px) 100vw, 1000px" className="object-contain sepia-[.2]" />
                 </div>
                 <div className="absolute bottom-4 left-0 w-full text-center">
                    <span className="font-['Caveat',cursive,serif] text-[#E07A5F] text-3xl font-bold">{selectedPhoto.category}</span>
                 </div>
               </div>
            </div>
            
            <div className="p-8 md:p-12 flex-1 flex flex-col justify-center overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
              <div className="space-y-6 mb-12">
                <span className="inline-block text-xs font-black text-[#F4EBD9] bg-[#E07A5F] px-4 py-2 border-[3px] border-[#3D405B] rounded-full shadow-[3px_3px_0_0_#3D405B] uppercase tracking-wider -rotate-2">{selectedPhoto.category}</span>
                {selectedPhoto.caption ? (
                  <p className="text-[#3D405B] font-bold text-xl leading-relaxed bg-white/50 p-6 border-[3px] border-[#3D405B] rounded-xl shadow-[4px_4px_0_0_#81B29A] rotate-1">{selectedPhoto.caption}</p>
                ) : (
                  <p className="text-[#3D405B]/60 font-bold italic">Aucune description disponible.</p>
                )}
              </div>
              
              <div className="flex flex-col gap-5 w-full mt-auto">
                {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                  <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-[#81B29A] text-[#F4EBD9] border-[4px] border-[#3D405B] px-6 py-4 rounded-full font-black uppercase text-sm shadow-[4px_4px_0_0_#3D405B] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#3D405B] transition-transform">
                    <MessageCircle size={20} strokeWidth={3} /> {t("portfolio.inquire")}
                  </a>
                )}
                {selectedPhoto.instagramUrl && (
                  <a href={selectedPhoto.instagramUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-[#F4EBD9] text-[#3D405B] border-[4px] border-[#3D405B] px-6 py-4 rounded-full font-black uppercase text-sm shadow-[4px_4px_0_0_#3D405B] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#3D405B] transition-transform">
                    <ExternalLink size={20} strokeWidth={3} /> {t("portfolio.viewOnIG")}
                  </a>
                )}
                {relatedService && (
                  <Link href={`/book?service=${relatedService.id}`}
                    className="flex items-center justify-center gap-3 bg-[#F2CC8F] text-[#3D405B] border-[4px] border-[#3D405B] px-8 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-[4px_4px_0_0_#3D405B] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#3D405B] transition-all">
                    <Calendar size={22} strokeWidth={3} /> {t("portfolio.bookThis")}
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
