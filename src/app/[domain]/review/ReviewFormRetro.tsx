import { Star, Upload, CheckCircle2, X } from "lucide-react";
import { useReviewForm } from "./useReviewForm";

export function ReviewFormRetro({
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
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in duration-700 bg-[#F4EBD9] text-[#3D405B]">
        <div className="w-24 h-24 bg-[#E07A5F] border-[4px] border-[#3D405B] shadow-[6px_6px_0_0_#3D405B] rounded-full flex items-center justify-center mb-8 rotate-3">
          <CheckCircle2 className="w-12 h-12 text-[#F4EBD9]" strokeWidth={3} />
        </div>
        <h1 className="text-5xl font-black mb-4 uppercase text-[#E07A5F] drop-shadow-[2px_2px_0_#3D405B] -rotate-2">{t("review.successTitle")}</h1>
        <p className="text-[#3D405B] font-bold uppercase tracking-widest mt-4 bg-[#81B29A] px-6 py-2 rounded-lg border-[3px] border-[#3D405B] rotate-1">{t("review.successMsg")}</p>
      </div>
    );
  }

  if (!showEditForm) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in zoom-in duration-300 bg-[#F4EBD9] text-[#3D405B]">
        <div className="w-24 h-24 bg-[#81B29A] border-[4px] border-[#3D405B] shadow-[6px_6px_0_0_#3D405B] rounded-full flex items-center justify-center mb-8 rotate-3">
          <CheckCircle2 size={40} className="text-[#F4EBD9]" strokeWidth={3} />
        </div>
        <h1 className="text-5xl font-black mb-6 uppercase text-[#E07A5F] drop-shadow-[2px_2px_0_#3D405B] -rotate-2">
          Merci !
        </h1>
        <p className="text-[#3D405B] font-bold uppercase tracking-wider mb-10 max-w-md mx-auto bg-white/50 px-6 py-3 rounded-lg border-[3px] border-[#3D405B] rotate-1">
          Vous avez déjà laissé un avis pour ce rendez-vous.
        </p>
        <button 
          onClick={() => setShowEditForm(true)}
          className="bg-[#F2CC8F] border-[4px] border-[#3D405B] text-[#3D405B] font-black uppercase py-4 px-8 rounded-full shadow-[6px_6px_0_0_#3D405B] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#3D405B] active:translate-y-1 active:shadow-[2px_2px_0_0_#3D405B] transition-all duration-200 -rotate-1"
        >
          Modifier mon avis
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#F4EBD9] min-h-screen text-[#3D405B] selection:bg-[#E07A5F] selection:text-[#F4EBD9] pb-12">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-16 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-[#E07A5F] drop-shadow-[3px_3px_0_#3D405B] -rotate-2 mb-6">
            {t("review.leaveReview")}
          </h1>
          <p className="text-[#3D405B] font-bold border-[3px] border-[#3D405B] bg-[#81B29A] px-6 py-3 rounded-xl shadow-[4px_4px_0_0_#3D405B] rotate-1 text-white">
            {t("review.reviewOn")} <strong className="font-black text-[#F4EBD9] underline decoration-wavy decoration-[#E07A5F]">{serviceName}</strong><br/>{t("review.onDate")} {date}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-white border-[4px] border-[#3D405B] p-6 md:p-10 rounded-2xl shadow-[12px_12px_0_0_#E07A5F] space-y-10 relative">
          
          {/* Rating */}
          <div className="flex flex-col items-center bg-[#F2CC8F] border-[3px] border-[#3D405B] rounded-xl p-6 -mx-2 md:-mx-4 shadow-[4px_4px_0_0_#3D405B] rotate-1">
            <p className="text-lg font-black text-[#3D405B] mb-4 uppercase tracking-widest">{t("review.ratingLabel")}</p>
            <div className="flex gap-2 bg-white border-[3px] border-[#3D405B] p-3 rounded-full shadow-[4px_4px_0_0_#3D405B] -rotate-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-2 transition-transform hover:-translate-y-2 hover:rotate-12"
                >
                  <Star 
                    size={40} 
                    strokeWidth={3}
                    className={`transition-colors ${(hoverRating || rating) >= star ? "fill-[#E07A5F] text-[#E07A5F] drop-shadow-[2px_2px_0_#3D405B]" : "text-[#3D405B]/20"}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-4">
            <label className="block text-lg font-black text-[#F4EBD9] uppercase bg-[#81B29A] border-[3px] border-[#3D405B] px-4 py-2 w-fit rounded-full shadow-[2px_2px_0_0_#3D405B] -rotate-1">{t("review.yourComment")}</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("review.commentPlaceholder")}
              className="w-full bg-[#F4EBD9] border-[3px] border-[#3D405B] p-6 rounded-xl outline-none focus:border-[#E07A5F] focus:shadow-[6px_6px_0_0_#3D405B] transition-all font-bold text-[#3D405B] min-h-[160px] resize-y shadow-[4px_4px_0_0_#3D405B]"
            />
          </div>

          {/* Photo Upload */}
          <div className="pt-4">
            <label className="block text-lg font-black text-[#3D405B] uppercase bg-[#F2CC8F] border-[3px] border-[#3D405B] px-4 py-2 w-fit rounded-full shadow-[2px_2px_0_0_#3D405B] rotate-1 mb-6">{t("review.addPhoto")}</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
              {existingMedia.map((media, idx) => (
                <div key={`existing-${idx}`} className="relative aspect-square overflow-hidden bg-white border-[3px] border-[#3D405B] shadow-[4px_4px_0_0_#3D405B] rounded-xl p-2 pb-8 group rotate-1">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setExistingMedia(existingMedia.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-0 right-0 bg-[#E07A5F] border-b-[3px] border-l-[3px] border-[#3D405B] text-[#F4EBD9] p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#3D405B] hover:text-[#E07A5F] rounded-bl-lg"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                  {media.type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover border-[2px] border-[#3D405B] rounded-lg sepia-[.2]" />
                  ) : (
                    <img src={media.url} alt={`Existing media ${idx}`} className="w-full h-full object-cover border-[2px] border-[#3D405B] rounded-lg sepia-[.2]" />
                  )}
                  <div className="absolute bottom-1 left-0 w-full text-center">
                    <span className="font-['Caveat',cursive,serif] text-[#3D405B] font-bold -rotate-2 inline-block">Old</span>
                  </div>
                </div>
              ))}

              {previewUrls.map((media, idx) => (
                <div key={`new-${idx}`} className="relative aspect-square overflow-hidden bg-white border-[3px] border-[#3D405B] shadow-[4px_4px_0_0_#3D405B] rounded-xl p-2 pb-8 group -rotate-1">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setPreviewUrls(previewUrls.filter((_, i) => i !== idx));
                      setFilesToUpload(filesToUpload.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-0 right-0 bg-[#E07A5F] border-b-[3px] border-l-[3px] border-[#3D405B] text-[#F4EBD9] p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#3D405B] hover:text-[#E07A5F] rounded-bl-lg"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                  {media.type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover border-[2px] border-[#3D405B] rounded-lg sepia-[.2]" />
                  ) : (
                    <img src={media.url} alt={`New media ${idx}`} className="w-full h-full object-cover border-[2px] border-[#3D405B] rounded-lg sepia-[.2]" />
                  )}
                   <div className="absolute bottom-1 left-0 w-full text-center">
                    <span className="font-['Caveat',cursive,serif] text-[#E07A5F] font-bold rotate-2 inline-block">New</span>
                  </div>
                </div>
              ))}

              <label className="relative flex flex-col items-center justify-center w-full aspect-square border-[3px] border-dashed border-[#3D405B] rounded-xl cursor-pointer hover:border-solid hover:shadow-[4px_4px_0_0_#3D405B] hover:-translate-y-1 transition-all bg-[#F4EBD9]">
                <Upload className="w-8 h-8 text-[#3D405B] mb-2" strokeWidth={3} />
                <span className="text-sm font-black text-[#3D405B] uppercase">Ajouter</span>
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
            <p className="text-sm font-bold text-[#3D405B]/80 bg-white border-[3px] border-[#3D405B] p-3 rounded-lg shadow-[2px_2px_0_0_#3D405B] rotate-1">{t("review.photoHint")}</p>
          </div>

          {/* Anonymous Toggle */}
          <label className="flex items-center gap-4 p-5 bg-[#F4EBD9] border-[3px] border-[#3D405B] rounded-xl cursor-pointer shadow-[4px_4px_0_0_#3D405B] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#3D405B] transition-all -rotate-1 mt-8">
            <input 
              type="checkbox" 
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-6 h-6 border-[3px] border-[#3D405B] text-[#E07A5F] focus:ring-[#E07A5F] focus:ring-offset-0 focus:ring-2 rounded"
            />
            <div>
              <p className="font-black text-base text-[#3D405B] uppercase tracking-wider">{t("review.stayAnonymous")}</p>
              <p className="text-xs font-bold text-[#3D405B]/70 mt-1 uppercase">{t("review.anonymousDesc").replace("{name}", clientName)}</p>
            </div>
          </label>

          {/* Submit */}
          <button 
            disabled={isPending}
            type="submit"
            className="w-full bg-[#E07A5F] text-[#F4EBD9] border-[4px] border-[#3D405B] p-5 rounded-full font-black uppercase text-lg shadow-[8px_8px_0_0_#3D405B] hover:-translate-y-2 hover:shadow-[12px_12px_0_0_#3D405B] active:translate-y-0 active:shadow-[0_0_0_0_#3D405B] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-3 mt-8"
          >
            {isPending ? (
              <div className="w-6 h-6 border-[4px] border-white border-t-[#3D405B] rounded-full animate-spin" />
            ) : (
              <>{t("review.submitBtn")}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
