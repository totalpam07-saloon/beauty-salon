import { Star, Upload, CheckCircle2, X } from "lucide-react";
import { useReviewForm } from "./useReviewForm";

export function ReviewFormPlayful({
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
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in duration-700 bg-[#F0F5FF] text-slate-800 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[50px] -z-10 animate-pulse" />
        <div className="w-24 h-24 bg-white/70 backdrop-blur-md rounded-[2rem] flex items-center justify-center mb-6 shadow-xl border border-white">
          <CheckCircle2 className="w-12 h-12 text-primary" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">{t("review.successTitle")}</h1>
        <p className="text-slate-600 font-bold bg-white/50 px-6 py-2 rounded-full shadow-sm">{t("review.successMsg")}</p>
      </div>
    );
  }

  if (!showEditForm) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in zoom-in duration-300 bg-[#F0F5FF] text-slate-800 relative overflow-hidden">
        <div className="w-24 h-24 bg-white/70 backdrop-blur-md rounded-[2rem] flex items-center justify-center mb-8 shadow-xl border border-white">
          <CheckCircle2 size={40} className="text-[#25D366]" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
          Merci !
        </h1>
        <p className="text-slate-600 text-lg font-bold mb-10 max-w-md mx-auto bg-white/50 px-6 py-3 rounded-2xl shadow-sm">
          Vous avez déjà laissé un avis pour ce rendez-vous.
        </p>
        <button 
          onClick={() => setShowEditForm(true)}
          className="bg-white text-slate-700 font-bold py-4 px-8 rounded-full shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all border border-white/50"
        >
          Modifier mon avis
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#F0F5FF] min-h-screen text-slate-800 selection:bg-purple-300 selection:text-slate-900 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 animate-[blob_7s_infinite]"></div>
      <div className="absolute top-40 left-0 w-72 h-72 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 animate-[blob_7s_infinite_2s]"></div>

      <div className="max-w-2xl mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="text-center mb-12">
          <span className="bg-white/60 backdrop-blur-md text-primary font-bold px-4 py-1.5 rounded-full text-xs shadow-sm mb-4 inline-block uppercase tracking-wider">Avis</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">{t("review.leaveReview")}</h1>
          <p className="text-slate-600 mt-2 font-bold bg-white/40 px-6 py-3 rounded-2xl inline-block shadow-sm">
            {t("review.reviewOn")} <strong className="text-primary font-extrabold">{serviceName}</strong><br/>{t("review.onDate")} {date}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[3rem] p-6 md:p-10 shadow-xl space-y-8">
          
          {/* Rating */}
          <div className="flex flex-col items-center bg-white/50 p-6 rounded-[2rem] shadow-inner">
            <p className="text-sm font-extrabold text-slate-700 mb-4 uppercase tracking-widest">{t("review.ratingLabel")}</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 hover:-translate-y-1"
                >
                  <Star 
                    size={44} 
                    strokeWidth={2}
                    className={`transition-all duration-300 ${(hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400 drop-shadow-md" : "text-slate-300"}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-3">
            <label className="block text-sm font-extrabold text-slate-700 ml-4 uppercase tracking-wider">{t("review.yourComment")}</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("review.commentPlaceholder")}
              className="w-full bg-white/60 border-2 border-white rounded-[2rem] p-6 outline-none focus:border-primary/50 focus:bg-white transition-all font-bold text-slate-700 min-h-[160px] resize-y shadow-inner"
            />
          </div>

          {/* Photo Upload */}
          <div className="bg-white/50 p-6 rounded-[2rem] shadow-inner">
            <label className="block text-sm font-extrabold text-slate-700 mb-4 uppercase tracking-wider">{t("review.addPhoto")}</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {existingMedia.map((media, idx) => (
                <div key={`existing-${idx}`} className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-white/50 shadow-md group border border-white">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setExistingMedia(existingMedia.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-2 right-2 bg-white/80 text-pink-500 rounded-full p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-pink-500 hover:text-white"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                  {media.type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={media.url} alt={`Existing media ${idx}`} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}

              {previewUrls.map((media, idx) => (
                <div key={`new-${idx}`} className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-white/50 shadow-md group border-2 border-primary/50">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setPreviewUrls(previewUrls.filter((_, i) => i !== idx));
                      setFilesToUpload(filesToUpload.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-2 right-2 bg-white/80 text-pink-500 rounded-full p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-pink-500 hover:text-white"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                  {media.type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={media.url} alt={`New media ${idx}`} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}

              <label className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-primary/30 rounded-[1.5rem] cursor-pointer hover:border-primary/60 hover:bg-white transition-all bg-white/40 shadow-sm">
                <Upload className="w-8 h-8 text-primary mb-2" strokeWidth={2} />
                <span className="text-sm font-extrabold text-primary uppercase">Ajouter</span>
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
            <p className="text-xs font-bold text-slate-500 text-center">{t("review.photoHint")}</p>
          </div>

          {/* Anonymous Toggle */}
          <label className="flex items-center gap-4 p-5 bg-white/60 border border-white rounded-[2rem] cursor-pointer hover:bg-white transition-colors shadow-sm">
            <input 
              type="checkbox" 
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-6 h-6 rounded-[0.5rem] border-2 border-primary/30 text-primary focus:ring-primary focus:ring-offset-0 focus:ring-2 shadow-inner"
            />
            <div>
              <p className="font-extrabold text-sm text-slate-700 uppercase">{t("review.stayAnonymous")}</p>
              <p className="text-xs font-bold text-slate-500 mt-1">{t("review.anonymousDesc").replace("{name}", clientName)}</p>
            </div>
          </label>

          {/* Submit */}
          <button 
            disabled={isPending}
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-purple-500 text-white p-5 rounded-[2rem] font-extrabold hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:bg-gray-400 shadow-md shadow-primary/20 flex items-center justify-center gap-3 text-lg uppercase tracking-wider"
          >
            {isPending ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>{t("review.submitBtn")}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
