import { Star, Upload, CheckCircle2, X } from "lucide-react";
import { useReviewForm } from "./useReviewForm";

export function ReviewFormSpa({
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
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in duration-700 bg-[#F9F6F0] text-[#5C5447]">
        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-[#3D372F]" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-light mb-4 text-[#3D372F] tracking-wide">{t("review.successTitle")}</h1>
        <p className="text-[#7A7265] font-light">{t("review.successMsg")}</p>
      </div>
    );
  }

  if (!showEditForm) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in zoom-in duration-300 bg-[#F9F6F0] text-[#5C5447]">
        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-8">
          <CheckCircle2 size={40} className="text-[#3D372F]" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl md:text-4xl font-light text-[#3D372F] mb-4 tracking-wide">
          Merci !
        </h1>
        <p className="text-[#7A7265] text-lg font-light mb-10 max-w-md mx-auto">
          Vous avez déjà laissé un avis pour ce rendez-vous.
        </p>
        <button 
          onClick={() => setShowEditForm(true)}
          className="bg-white border border-[#E5DFD3] text-[#3D372F] font-light py-4 px-10 rounded-full hover:bg-[#3D372F] hover:text-white transition-all duration-300 shadow-sm"
        >
          Modifier mon avis
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#F9F6F0] min-h-screen text-[#5C5447]">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-[#3D372F] tracking-wide mb-3">{t("review.leaveReview")}</h1>
          <p className="text-[#7A7265] font-light">
            {t("review.reviewOn")} <strong className="font-medium text-[#3D372F]">{serviceName}</strong> {t("review.onDate")} {date}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-[#E5DFD3] space-y-10">
          
          {/* Rating */}
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-[#3D372F] mb-4 tracking-widest uppercase">{t("review.ratingLabel")}</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-105"
                >
                  <Star 
                    size={40} 
                    strokeWidth={1.5}
                    className={`transition-colors duration-300 ${(hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-[#E5DFD3]"}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#3D372F] ml-2">{t("review.yourComment")}</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("review.commentPlaceholder")}
              className="w-full bg-[#F9F6F0] border border-transparent rounded-2xl p-6 outline-none focus:border-[#3D372F]/20 focus:bg-white transition-all font-light text-[#5C5447] min-h-[140px] resize-y shadow-inner"
            />
          </div>

          {/* Photo Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-[#3D372F] ml-2 mb-4">{t("review.addPhoto")}</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {existingMedia.map((media, idx) => (
                <div key={`existing-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden bg-[#F9F6F0] group border border-[#E5DFD3]">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setExistingMedia(existingMedia.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-2 right-2 bg-white/80 text-[#3D372F] rounded-full p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                  {media.type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={media.url} alt={`Existing media ${idx}`} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}

              {previewUrls.map((media, idx) => (
                <div key={`new-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden bg-[#F9F6F0] group border border-[#3D372F]/20">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setPreviewUrls(previewUrls.filter((_, i) => i !== idx));
                      setFilesToUpload(filesToUpload.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-2 right-2 bg-white/80 text-[#3D372F] rounded-full p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                  {media.type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={media.url} alt={`New media ${idx}`} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}

              <label className="relative flex flex-col items-center justify-center w-full aspect-square border border-dashed border-[#E5DFD3] rounded-2xl cursor-pointer hover:border-[#3D372F]/30 hover:bg-[#F9F6F0] transition-colors bg-white">
                <Upload className="w-6 h-6 text-[#7A7265] mb-2" strokeWidth={1.5} />
                <span className="text-sm font-light text-[#7A7265]">Ajouter</span>
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
            <p className="text-xs font-light text-[#7A7265]/70 ml-2">{t("review.photoHint")}</p>
          </div>

          {/* Anonymous Toggle */}
          <label className="flex items-center gap-4 p-5 bg-[#F9F6F0] rounded-2xl cursor-pointer hover:bg-[#E5DFD3]/30 transition-colors">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 rounded border-[#E5DFD3] text-[#3D372F] focus:ring-[#3D372F] shadow-sm"
              />
            </div>
            <div>
              <p className="font-medium text-sm text-[#3D372F]">{t("review.stayAnonymous")}</p>
              <p className="text-xs font-light text-[#7A7265] mt-1">{t("review.anonymousDesc").replace("{name}", clientName)}</p>
            </div>
          </label>

          {/* Submit */}
          <button 
            disabled={isPending}
            type="submit"
            className="w-full bg-[#3D372F] text-white p-5 rounded-full font-light tracking-wide hover:bg-black transition-all duration-300 disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
          >
            {isPending ? (
              <div className="w-5 h-5 border-[1.5px] border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>{t("review.submitBtn")}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
