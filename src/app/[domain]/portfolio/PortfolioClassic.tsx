import { Images, X, ExternalLink, Calendar, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Service, SalonSettings, PortfolioPhoto } from "@/store/salon";
import { usePortfolio } from "./usePortfolio";

export function PortfolioClassic({
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
    <div className="flex-1 w-full bg-background transition-colors duration-300 min-h-screen flex flex-col">
      

      {/* Page Header */}
      <section className="relative w-full py-16 flex flex-col items-center text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -z-10" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3 tracking-tight">
          {t("portfolio.title")}
        </h1>
        <p className="text-foreground/60 text-lg font-medium max-w-md mb-8">
          {t("portfolio.subtitle")}
        </p>
        <Link href="/book" className="flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full font-bold shadow-lg hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
          <Calendar size={18} /> {t("home.bookNow")}
        </Link>
      </section>

      {/* Filter Bar */}
      {categories.length > 1 && (
        <div className="max-w-5xl mx-auto px-4 mb-8 overflow-x-auto w-full">
          <div className="flex gap-2 pb-1 justify-center min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                  activeFilter === cat
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "bg-card border border-border text-foreground/60 hover:border-primary/50"
                }`}
              >
                {cat === "all" ? t("portfolio.all") : cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-20 w-full flex-1">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-foreground/30 font-medium">
            <Images className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>{t("portfolio.empty")}</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 md:columns-4 gap-3">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelected(photo.id)}
                className="break-inside-avoid mb-3 rounded-2xl overflow-hidden cursor-pointer group relative shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={((photo as any).image_url || photo.imageUrl || "/placeholder.png")}
                  alt={photo.caption || photo.category}
                  width={0}
                  height={0}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  style={{ width: '100%', height: 'auto' }}
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex flex-col items-start justify-end p-3 opacity-0 group-hover:opacity-100">
                  <span className="text-white font-bold text-sm bg-primary/80 px-2 py-0.5 rounded-full">{photo.category}</span>
                  {photo.caption && <p className="text-white/90 text-xs mt-1 line-clamp-2">{photo.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selected && selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-card rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[60vh]">
              <Image src={((selectedPhoto as any).image_url || selectedPhoto.imageUrl || "/placeholder.png")} alt={selectedPhoto.caption || ""} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" />
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors z-10">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-full">{selectedPhoto.category}</span>
              </div>
              {selectedPhoto.caption && <p className="text-foreground/80 font-medium">{selectedPhoto.caption}</p>}
              <div className="flex flex-wrap gap-3 pt-1">
                {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                  <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366]/10 text-[#25D366] px-4 py-2.5 rounded-2xl font-bold text-sm hover:bg-[#25D366]/20 transition-colors">
                    <MessageCircle size={15} /> Poser une question
                  </a>
                )}
                {selectedPhoto.instagramUrl && (
                  <a href={selectedPhoto.instagramUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 border-2 border-border px-4 py-2.5 rounded-2xl font-bold text-sm text-foreground/70 hover:border-primary/50 transition-colors">
                    <ExternalLink size={15} /> {t("portfolio.viewOnIG")}
                  </a>
                )}
                {relatedService && (
                  <Link href={`/book?service=${relatedService.id}`}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity">
                    <Calendar size={15} /> {t("portfolio.bookThis")}
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
