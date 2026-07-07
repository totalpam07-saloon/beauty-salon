import { Images, X, ExternalLink, Calendar, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Service, SalonSettings, PortfolioPhoto } from "@/store/salon";
import { usePortfolio } from "./usePortfolio";

export function PortfolioPlayful({
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
    <div className="flex-1 w-full bg-[#F0F5FF] text-slate-800 font-sans min-h-screen flex flex-col relative selection:bg-purple-300 selection:text-slate-900">
      {/* Background Animated Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-300/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-[blob_7s_infinite]"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-purple-300/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-[blob_7s_infinite_2s]"></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-cyan-300/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-[blob_7s_infinite_4s]"></div>
      </div>

      

      {/* Page Header */}
      <section className="relative w-full py-24 flex flex-col items-center text-center px-4 z-10">
        <span className="bg-white/60 backdrop-blur-md text-primary font-bold px-4 py-1.5 rounded-full text-sm shadow-sm mb-6 inline-block uppercase tracking-wider">
          Galerie
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
          {t("portfolio.title")}
        </h1>
        <p className="text-slate-600 text-lg font-medium max-w-lg mb-10 leading-relaxed bg-white/40 p-4 rounded-2xl">
          {t("portfolio.subtitle")}
        </p>
        <Link href="/book" className="group flex items-center gap-2 bg-gradient-to-r from-primary to-purple-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <Calendar size={20} className="group-hover:animate-bounce" /> {t("home.bookNow")}
        </Link>
      </section>

      {/* Filter Bar */}
      {categories.length > 1 && (
        <div className="max-w-6xl mx-auto px-6 mb-12 overflow-x-auto w-full z-10">
          <div className="flex gap-3 pb-4 justify-center min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 shadow-sm ${
                  activeFilter === cat
                    ? "bg-gradient-to-r from-primary to-purple-500 text-white shadow-primary/30 scale-105"
                    : "bg-white/70 backdrop-blur-sm text-slate-600 hover:bg-white hover:text-slate-800 border border-white/50"
                }`}
              >
                {cat === "all" ? t("portfolio.all") : cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24 w-full flex-1 z-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-400 font-bold bg-white/50 rounded-[3rem] border border-white/50 backdrop-blur-sm">
            <Images className="w-20 h-20 mx-auto mb-6 opacity-50" strokeWidth={2} />
            <p className="text-xl">{t("portfolio.empty")}</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelected(photo.id)}
                className="break-inside-avoid mb-6 rounded-[2rem] overflow-hidden cursor-pointer group relative bg-white/70 backdrop-blur-sm border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.05)] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 p-2"
              >
                <div className="rounded-[1.5rem] overflow-hidden relative">
                  <Image
                    src={((photo as any).image_url || photo.imageUrl || "/placeholder.png")}
                    alt={photo.caption || photo.category}
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, 33vw"
                    style={{ width: '100%', height: 'auto' }}
                    className="group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-white font-extrabold text-[10px] uppercase bg-gradient-to-r from-primary to-purple-500 px-3 py-1.5 rounded-xl shadow-md">{photo.category}</span>
                  </div>
                </div>
                {photo.caption && (
                  <div className="p-4 bg-transparent flex flex-col">
                    <p className="text-slate-600 font-bold text-sm line-clamp-2">{photo.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selected && selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white/90 backdrop-blur-xl border border-white rounded-[3rem] w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 bg-white/80 text-slate-600 p-3 rounded-full hover:bg-white hover:text-primary transition-colors z-20 shadow-md">
              <X size={24} strokeWidth={2.5} />
            </button>
            <div className="relative w-full md:w-3/5 h-[40vh] md:h-[80vh] bg-slate-100/50 shrink-0 p-4">
              <div className="w-full h-full relative rounded-[2rem] overflow-hidden shadow-inner">
                <Image src={((selectedPhoto as any).image_url || selectedPhoto.imageUrl || "/placeholder.png")} alt={selectedPhoto.caption || ""} fill sizes="(max-width: 1024px) 100vw, 1000px" className="object-cover" />
              </div>
            </div>
            
            <div className="p-8 md:p-12 flex-1 flex flex-col justify-center overflow-y-auto bg-gradient-to-b from-transparent to-white/50">
              <div className="space-y-4 mb-10">
                <span className="inline-block text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 bg-white/80 px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 uppercase tracking-wider">{selectedPhoto.category}</span>
                {selectedPhoto.caption ? (
                  <p className="text-slate-700 font-extrabold text-xl leading-relaxed">{selectedPhoto.caption}</p>
                ) : (
                  <p className="text-slate-400 font-bold italic">Aucune description disponible.</p>
                )}
              </div>
              
              <div className="flex flex-col gap-4 w-full mt-auto">
                {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                  <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-white border border-white/50 text-slate-600 px-8 py-4 rounded-2xl font-bold shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                    <MessageCircle size={20} strokeWidth={2.5} className="text-[#25D366]" /> {t("portfolio.inquire")}
                  </a>
                )}
                {selectedPhoto.instagramUrl && (
                  <a href={selectedPhoto.instagramUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-white border border-white/50 text-slate-600 px-8 py-4 rounded-2xl font-bold shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                    <ExternalLink size={20} strokeWidth={2.5} className="text-pink-500" /> {t("portfolio.viewOnIG")}
                  </a>
                )}
                {relatedService && (
                  <Link href={`/book?service=${relatedService.id}`}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-purple-500 text-white px-8 py-4 rounded-2xl font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all">
                    <Calendar size={20} strokeWidth={2.5} /> {t("portfolio.bookThis")}
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
