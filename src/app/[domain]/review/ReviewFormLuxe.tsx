import { Star, Upload, CheckCircle2, X } from "lucide-react";
import { useReviewForm } from "./useReviewForm";

export function ReviewFormLuxe({
  tenantId,
  appointmentId,
  clientName,
  serviceName,
  date,
  settings,
  flow
}: {
  tenantId: string;
  appointmentId: string;
  clientName: string;
  serviceName: string;
  date: string;
  settings: any;
  flow: ReturnType<typeof useReviewForm>;
}) {
  const {
    t,
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    comment,
    setComment,
    isAnonymous,
    setIsAnonymous,
    filesToUpload,
    setFilesToUpload,
    existingMedia,
    setExistingMedia,
    previewUrls,
    setPreviewUrls,
    isPending,
    submitted,
    showEditForm,
    setShowEditForm,
    handleSubmit
  } = flow;

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in duration-700 bg-[#1A1A1A] text-white">
        <div className="w-24 h-24 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
          <CheckCircle2 className="w-12 h-12 text-[#D4AF37]" strokeWidth={1} />
        </div>
        <h1 className="text-4xl font-serif mb-4 tracking-widest uppercase text-[#D4AF37]">{t("review.successTitle")}</h1>
        <p className="text-white/60 font-light tracking-wide uppercase text-sm">{t("review.successMsg")}</p>
      </div>
    );
  }

  if (!showEditForm) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in zoom-in duration-300 bg-[#1A1A1A] text-white">
        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 size={40} className="text-[#D4AF37]" strokeWidth={1} />
        </div>
        <h1 className="text-4xl font-serif text-[#D4AF37] mb-6 tracking-widest uppercase">
          Merci !
        </h1>
        <p className="text-white/60 text-sm font-light uppercase tracking-widest mb-10 max-w-md mx-auto leading-relaxed">
          Vous avez déjà laissé un avis pour ce rendez-vous.
        </p>
        <button 
          onClick={() => setShowEditForm(true)}
          className="bg-transparent border border-[#D4AF37] text-[#D4AF37] font-serif uppercase tracking-widest text-sm py-4 px-10 hover:bg-[#D4AF37] hover:text-[#1A1A1A] transition-all duration-500"
        >
          Modifier mon avis
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#1A1A1A] min-h-screen text-white selection:bg-[#D4AF37] selection:text-[#1A1A1A]">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif text-[#D4AF37] tracking-widest uppercase mb-4">{t("review.leaveReview")}</h1>
          <p className="text-white/60 text-sm font-light uppercase tracking-wider leading-relaxed">
            {t("review.reviewOn")} <strong className="text-white font-normal">{serviceName}</strong> <br /> {t("review.onDate")} {date}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/10 p-8 md:p-12 space-y-10 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
          
          {/* Rating */}
          <div className="flex flex-col items-center">
            <p className="text-xs font-light text-white/50 mb-6 uppercase tracking-[0.3em]">{t("review.ratingLabel")}</p>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star 
                    size={36} 
                    strokeWidth={1}
                    className={`transition-colors duration-300 ${(hoverRating || rating) >= star ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white/20"}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-4">
            <label className="block text-xs font-light text-[#D4AF37] uppercase tracking-[0.2em] text-center">{t("review.yourComment")}</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("review.commentPlaceholder")}
              className="w-full bg-[#1A1A1A] border border-white/10 p-6 outline-none focus:border-[#D4AF37]/50 transition-all font-light text-sm text-white/80 min-h-[160px] resize-y"
            />
          </div>

          {/* Photo Upload */}
          <div className="pt-6 border-t border-white/5">
            <label className="block text-xs font-light text-[#D4AF37] uppercase tracking-[0.2em] text-center mb-6">{t("review.addPhoto")}</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {existingMedia.map((media, idx) => (
                <div key={`existing-${idx}`} className="relative aspect-square overflow-hidden bg-black/50 group border border-white/10">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setExistingMedia(existingMedia.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-2 right-2 bg-black/80 text-[#D4AF37] border border-[#D4AF37]/30 p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                  >
                    <X size={14} />
                  </button>
                  {media.type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={media.url} alt={`Existing media ${idx}`} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}

              {previewUrls.map((media, idx) => (
                <div key={`new-${idx}`} className="relative aspect-square overflow-hidden bg-black/50 group border border-[#D4AF37]/40">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setPreviewUrls(previewUrls.filter((_, i) => i !== idx));
                      setFilesToUpload(filesToUpload.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-2 right-2 bg-black/80 text-[#D4AF37] border border-[#D4AF37]/30 p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                  >
                    <X size={14} />
                  </button>
                  {media.type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={media.url} alt={`New media ${idx}`} className="w-full h-full object-cover opacity-80" />
                  )}
                </div>
              ))}

              <label className="relative flex flex-col items-center justify-center w-full aspect-square border border-dashed border-white/20 cursor-pointer hover:border-[#D4AF37]/50 hover:bg-white/5 transition-colors bg-[#1A1A1A]">
                <Upload className="w-6 h-6 text-white/40 mb-3" strokeWidth={1} />
                <span className="text-[10px] font-light text-white/50 uppercase tracking-widest">Ajouter</span>
                <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) {
                    setFilesToUpload([...filesToUpload, ...files]);
                    const newPreviews = files.map(file => ({
                      url: URL.createObjectURL(file),
                      type: file.type.startsWith('video/') ? 'video' : 'image'
                    } as const));
                    setPreviewUrls([...previewUrls, ...newPreviews]);
                  }
                }} />
              </label>
            </div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest text-center mt-4">{t("review.photoHint")}</p>
          </div>

          {/* Anonymous Toggle */}
          <label className="flex items-center gap-4 p-5 bg-[#1A1A1A] border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
            <input 
              type="checkbox" 
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 bg-transparent border border-white/30 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0 focus:ring-1"
            />
            <div>
              <p className="font-light text-sm text-white uppercase tracking-wider">{t("review.stayAnonymous")}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{t("review.anonymousDesc").replace("{name}", clientName)}</p>
            </div>
          </label>

          {/* Submit */}
          <button 
            disabled={isPending}
            type="submit"
            className="w-full bg-[#D4AF37] text-[#1A1A1A] p-5 font-serif uppercase tracking-[0.2em] text-sm hover:bg-white transition-all duration-500 disabled:opacity-50 disabled:bg-[#D4AF37]/50 flex items-center justify-center gap-3"
          >
            {isPending ? (
              <div className="w-5 h-5 border border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>{t("review.submitBtn")}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
