import { Star, Upload, CheckCircle2, X } from "lucide-react";
import { useReviewForm } from "./useReviewForm";

export function ReviewFormClassic({
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
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in duration-700 bg-background text-foreground">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-black mb-4">{t("review.successTitle")}</h1>
        <p className="text-foreground/60 font-medium">{t("review.successMsg")}</p>
      </div>
    );
  }

  if (!showEditForm) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in zoom-in duration-300 bg-background text-foreground">
        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 border-8 border-green-500/5">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
          Merci !
        </h1>
        <p className="text-foreground/60 text-lg mb-8 max-w-md mx-auto">
          Vous avez déjà laissé un avis pour ce rendez-vous.
        </p>
        <button 
          onClick={() => setShowEditForm(true)}
          className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Modifier mon avis
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-background min-h-screen text-foreground">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-foreground">{t("review.leaveReview")}</h1>
          <p className="text-foreground/60 mt-2 font-medium">
            {t("review.reviewOn")} <strong>{serviceName}</strong> {t("review.onDate")} {date}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-xl space-y-8">
          {/* Rating */}
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold text-foreground/80 mb-3 uppercase tracking-widest">{t("review.ratingLabel")}</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star 
                    size={40} 
                    className={`transition-colors ${(hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-foreground/20"}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-foreground/80 ml-2">{t("review.yourComment")}</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("review.commentPlaceholder")}
              className="w-full bg-background border-2 border-border rounded-2xl p-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium min-h-[120px] resize-y"
            />
          </div>

          {/* Photo Upload */}
          <div className="mb-8">
            <label className="block font-bold text-foreground mb-4">{t("review.addPhoto")}</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {/* Existing Media */}
              {existingMedia.map((media, idx) => (
                <div key={`existing-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/50 group border border-border">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setExistingMedia(existingMedia.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                  {media.type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={media.url} alt={`Existing media ${idx}`} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}

              {/* New Upload Previews */}
              {previewUrls.map((media, idx) => (
                <div key={`new-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/50 group border border-primary/20">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setPreviewUrls(previewUrls.filter((_, i) => i !== idx));
                      setFilesToUpload(filesToUpload.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                  {media.type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={media.url} alt={`New media ${idx}`} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}

              {/* Upload Button */}
              <label className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-primary/50 rounded-2xl cursor-pointer hover:bg-primary/5 transition-colors bg-background">
                <Upload className="w-8 h-8 text-primary mb-2" />
                <span className="text-sm font-medium text-foreground/70">Ajouter</span>
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
            <p className="text-xs text-foreground/50">{t("review.photoHint")}</p>
          </div>

          {/* Anonymous Toggle */}
          <label className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
            <input 
              type="checkbox" 
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
            />
            <div>
              <p className="font-bold text-sm text-foreground">{t("review.stayAnonymous")}</p>
              <p className="text-xs text-foreground/60 font-medium">{t("review.anonymousDesc").replace("{name}", clientName)}</p>
            </div>
          </label>

          {/* Submit */}
          <button 
            disabled={isPending}
            type="submit"
            className="w-full bg-primary text-primary-foreground p-5 rounded-2xl font-extrabold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
          >
            {isPending ? (
              <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>{t("review.submitBtn")}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
