import { Star, Upload, CheckCircle2, X } from "lucide-react";
import { useReviewForm } from "./useReviewForm";

export function ReviewFormEditorial({
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
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in duration-700 bg-white text-black border-x border-black/10 max-w-[1400px] mx-auto w-full">
        <div className="w-20 h-20 border border-black flex items-center justify-center mb-8">
          <CheckCircle2 className="w-10 h-10 text-black" strokeWidth={1} />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif mb-6 tracking-tighter uppercase">{t("review.successTitle")}</h1>
        <div className="w-16 h-px bg-black mb-6"></div>
        <p className="text-black/60 font-sans uppercase tracking-[0.2em] text-xs">{t("review.successMsg")}</p>
      </div>
    );
  }

  if (!showEditForm) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in zoom-in duration-300 bg-white text-black border-x border-black/10 max-w-[1400px] mx-auto w-full">
        <div className="w-20 h-20 border border-black flex items-center justify-center mb-10">
          <CheckCircle2 size={40} className="text-black" strokeWidth={1} />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-black mb-8 tracking-tighter uppercase">
          Merci !
        </h1>
        <p className="text-black/60 text-xs font-sans uppercase tracking-[0.2em] mb-12 max-w-md mx-auto leading-relaxed">
          Vous avez déjà laissé un avis pour ce rendez-vous.
        </p>
        <button 
          onClick={() => setShowEditForm(true)}
          className="bg-transparent border border-black text-black font-serif uppercase tracking-[0.2em] text-xs py-5 px-12 hover:bg-black hover:text-white transition-colors duration-500"
        >
          Modifier mon avis
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-white min-h-screen text-black selection:bg-black selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-24 border-x border-black/10 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-black/40 mb-4 block">Feedback</span>
            <h1 className="text-4xl md:text-5xl font-serif text-black tracking-tighter uppercase mb-6">{t("review.leaveReview")}</h1>
            <div className="w-12 h-px bg-black/20 mx-auto mb-6"></div>
            <p className="text-black/60 text-xs font-sans uppercase tracking-widest leading-relaxed">
              {t("review.reviewOn")} <strong className="text-black font-normal">{serviceName}</strong> <br/> {t("review.onDate")} {date}.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-black/10 p-8 md:p-16 space-y-12">
            
            {/* Rating */}
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-sans text-black/40 mb-6 uppercase tracking-[0.3em]">{t("review.ratingLabel")}</p>
              <div className="flex gap-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:-translate-y-1"
                  >
                    <Star 
                      size={32} 
                      strokeWidth={0.5}
                      className={`transition-colors duration-500 ${(hoverRating || rating) >= star ? "fill-black text-black" : "text-black/20"}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-6">
              <label className="block text-[10px] font-sans text-black/40 uppercase tracking-[0.3em] text-center">{t("review.yourComment")}</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("review.commentPlaceholder")}
                className="w-full bg-zinc-50 border-none p-8 outline-none focus:bg-zinc-100 transition-colors font-serif text-lg text-black/80 min-h-[200px] resize-y placeholder:text-black/20"
              />
            </div>

            {/* Photo Upload */}
            <div className="pt-12 border-t border-black/10">
              <label className="block text-[10px] font-sans text-black/40 uppercase tracking-[0.3em] text-center mb-8">{t("review.addPhoto")}</label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mb-8">
                {existingMedia.map((media, idx) => (
                  <div key={`existing-${idx}`} className="relative aspect-square overflow-hidden bg-zinc-100 group">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setExistingMedia(existingMedia.filter((_, i) => i !== idx));
                      }}
                      className="absolute top-2 right-2 bg-white/90 text-black p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-white"
                    >
                      <X size={14} strokeWidth={1} />
                    </button>
                    {media.type === 'video' ? (
                      <video src={media.url} className="w-full h-full object-cover grayscale" />
                    ) : (
                      <img src={media.url} alt={`Existing media ${idx}`} className="w-full h-full object-cover grayscale" />
                    )}
                  </div>
                ))}

                {previewUrls.map((media, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square overflow-hidden bg-zinc-100 group border border-black">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setPreviewUrls(previewUrls.filter((_, i) => i !== idx));
                        setFilesToUpload(filesToUpload.filter((_, i) => i !== idx));
                      }}
                      className="absolute top-2 right-2 bg-white/90 text-black p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-white"
                    >
                      <X size={14} strokeWidth={1} />
                    </button>
                    {media.type === 'video' ? (
                      <video src={media.url} className="w-full h-full object-cover grayscale" />
                    ) : (
                      <img src={media.url} alt={`New media ${idx}`} className="w-full h-full object-cover grayscale" />
                    )}
                  </div>
                ))}

                <label className="relative flex flex-col items-center justify-center w-full aspect-square border border-black/10 cursor-pointer hover:border-black hover:bg-zinc-50 transition-colors bg-white">
                  <Upload className="w-5 h-5 text-black/40 mb-3" strokeWidth={1} />
                  <span className="text-[10px] font-sans text-black/50 uppercase tracking-widest">Ajouter</span>
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
              <p className="text-[10px] font-sans text-black/30 uppercase tracking-widest text-center">{t("review.photoHint")}</p>
            </div>

            {/* Anonymous Toggle */}
            <label className="flex items-start gap-4 p-6 bg-zinc-50 border border-transparent cursor-pointer hover:border-black/10 transition-colors mt-8">
              <input 
                type="checkbox" 
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 mt-1 bg-white border border-black/20 text-black focus:ring-black focus:ring-offset-0 focus:ring-1 rounded-none"
              />
              <div>
                <p className="font-sans text-xs text-black uppercase tracking-wider">{t("review.stayAnonymous")}</p>
                <p className="text-[10px] text-black/50 uppercase tracking-widest mt-2 leading-relaxed">{t("review.anonymousDesc").replace("{name}", clientName)}</p>
              </div>
            </label>

            {/* Submit */}
            <button 
              disabled={isPending}
              type="submit"
              className="w-full bg-transparent border border-black text-black p-6 font-serif uppercase tracking-[0.2em] text-xs hover:bg-black hover:text-white transition-all duration-500 disabled:opacity-50 disabled:bg-transparent flex items-center justify-center gap-4 mt-12"
            >
              {isPending ? (
                <div className="w-4 h-4 border border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>{t("review.submitBtn")}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
