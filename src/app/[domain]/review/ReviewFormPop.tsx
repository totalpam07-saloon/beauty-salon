import { Star, Upload, CheckCircle2, X } from "lucide-react";
import { useReviewForm } from "./useReviewForm";

export function ReviewFormPop({
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
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in duration-700 bg-[#FAFAFA] text-black">
        <div className="w-24 h-24 bg-[#E5FBE5] border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-xl flex items-center justify-center mb-8 rotate-3">
          <CheckCircle2 className="w-12 h-12 text-black" strokeWidth={3} />
        </div>
        <h1 className="text-5xl font-black mb-4 uppercase bg-[#FFE5E5] border-4 border-black px-6 py-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] -rotate-2">{t("review.successTitle")}</h1>
        <p className="text-black font-bold uppercase mt-6">{t("review.successMsg")}</p>
      </div>
    );
  }

  if (!showEditForm) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in zoom-in duration-300 bg-[#FAFAFA] text-black">
        <div className="w-24 h-24 bg-[#E5FBE5] border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-xl flex items-center justify-center mb-8 rotate-3">
          <CheckCircle2 size={40} className="text-black" strokeWidth={3} />
        </div>
        <h1 className="text-5xl font-black mb-6 uppercase bg-primary border-4 border-black px-6 py-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] -rotate-2 text-white">
          Merci !
        </h1>
        <p className="text-black font-bold uppercase mb-10 max-w-md mx-auto">
          Vous avez déjà laissé un avis pour ce rendez-vous.
        </p>
        <button 
          onClick={() => setShowEditForm(true)}
          className="bg-white border-4 border-black text-black font-black uppercase py-4 px-8 shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all duration-200 rotate-1"
        >
          Modifier mon avis
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#FAFAFA] min-h-screen text-black selection:bg-primary selection:text-white pb-12">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-16 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase inline-block bg-[#FFE5E5] border-4 border-black px-6 py-3 shadow-[6px_6px_0_0_rgba(0,0,0,1)] -rotate-2 mb-6">
            {t("review.leaveReview")}
          </h1>
          <p className="text-black font-bold border-2 border-black bg-white px-4 py-2 rounded-lg shadow-[2px_2px_0_0_rgba(0,0,0,1)] rotate-1">
            {t("review.reviewOn")} <strong className="font-black text-primary">{serviceName}</strong><br/>{t("review.onDate")} {date}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-6 md:p-10 shadow-[12px_12px_0_0_rgba(0,0,0,1)] space-y-10 relative">
          
          {/* Rating */}
          <div className="flex flex-col items-center bg-[#F0F0F0] border-4 border-black p-6 -mx-2 md:-mx-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] rotate-1">
            <p className="text-lg font-black text-black mb-4 uppercase">{t("review.ratingLabel")}</p>
            <div className="flex gap-2 bg-white border-4 border-black p-3 rounded-full shadow-[4px_4px_0_0_rgba(0,0,0,1)] -rotate-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-2 transition-transform hover:-translate-y-2"
                >
                  <Star 
                    size={40} 
                    strokeWidth={3}
                    className={`transition-colors ${(hoverRating || rating) >= star ? "fill-primary text-black drop-shadow-[2px_2px_0_rgba(0,0,0,1)]" : "text-black/20"}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-4">
            <label className="block text-lg font-black text-black uppercase bg-[#E5FBE5] border-2 border-black px-3 py-1 w-fit shadow-[2px_2px_0_0_rgba(0,0,0,1)] -rotate-1">{t("review.yourComment")}</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("review.commentPlaceholder")}
              className="w-full bg-white border-4 border-black p-6 outline-none focus:border-primary focus:shadow-[8px_8px_0_0_rgba(0,0,0,1)] transition-all font-bold text-black min-h-[160px] resize-y shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            />
          </div>

          {/* Photo Upload */}
          <div className="pt-4">
            <label className="block text-lg font-black text-black uppercase bg-[#E5E5FB] border-2 border-black px-3 py-1 w-fit shadow-[2px_2px_0_0_rgba(0,0,0,1)] rotate-1 mb-6">{t("review.addPhoto")}</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
              {existingMedia.map((media, idx) => (
                <div key={`existing-${idx}`} className="relative aspect-square overflow-hidden bg-white border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] group">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setExistingMedia(existingMedia.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-2 right-2 bg-white border-2 border-black text-black p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-primary hover:text-white"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                  {media.type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={media.url} alt={`Existing media ${idx}`} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}

              {previewUrls.map((media, idx) => (
                <div key={`new-${idx}`} className="relative aspect-square overflow-hidden bg-white border-4 border-primary shadow-[4px_4px_0_0_rgba(0,0,0,1)] group">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setPreviewUrls(previewUrls.filter((_, i) => i !== idx));
                      setFilesToUpload(filesToUpload.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-2 right-2 bg-white border-2 border-black text-black p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-primary hover:text-white"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                  {media.type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={media.url} alt={`New media ${idx}`} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}

              <label className="relative flex flex-col items-center justify-center w-full aspect-square border-4 border-dashed border-black cursor-pointer hover:border-solid hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all bg-[#F0F0F0]">
                <Upload className="w-8 h-8 text-black mb-2" strokeWidth={3} />
                <span className="text-sm font-black text-black uppercase">Ajouter</span>
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
            <p className="text-sm font-bold text-black/60 bg-white border-2 border-black p-2 inline-block shadow-[2px_2px_0_0_rgba(0,0,0,1)] rotate-1">{t("review.photoHint")}</p>
          </div>

          {/* Anonymous Toggle */}
          <label className="flex items-center gap-4 p-5 bg-white border-4 border-black cursor-pointer shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all -rotate-1 mt-8">
            <input 
              type="checkbox" 
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-6 h-6 border-4 border-black text-primary focus:ring-primary focus:ring-offset-0 focus:ring-2"
            />
            <div>
              <p className="font-black text-base text-black uppercase">{t("review.stayAnonymous")}</p>
              <p className="text-xs font-bold text-black/70 mt-1 uppercase">{t("review.anonymousDesc").replace("{name}", clientName)}</p>
            </div>
          </label>

          {/* Submit */}
          <button 
            disabled={isPending}
            type="submit"
            className="w-full bg-primary text-white border-4 border-black p-5 font-black uppercase text-lg shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0_0_0_0_rgba(0,0,0,1)] transition-all duration-200 disabled:opacity-50 disabled:bg-gray-400 flex items-center justify-center gap-3 mt-8"
          >
            {isPending ? (
              <div className="w-6 h-6 border-4 border-white border-t-black rounded-full animate-spin" />
            ) : (
              <>{t("review.submitBtn")}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
