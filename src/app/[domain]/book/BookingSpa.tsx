import { ArrowRight, CheckCircle2, ChevronDown, MessageCircle, User, Upload, X } from "lucide-react";
import { WeekCalendar } from "@/components/week-calendar";
import Link from "next/link";
import Image from "next/image";
import { Service, SalonSettings, Appointment, Staff } from "@/store/salon";
import { useBookingFlow } from "./useBookingFlow";
export function BookingSpa({
  tenantId,
  domain,
  services,
  settings,
  appointments,
  staffList = [],
  flow
}: {
  tenantId: string;
  domain: string;
  services: Service[];
  settings: SalonSettings;
  appointments: Partial<Appointment>[];
  staffList?: Staff[];
  flow: ReturnType<typeof useBookingFlow>;
}) {
  const {
    t,
    language,
    step,
    setStep,
    selectedServiceId,
    setSelectedServiceId,
    selectedStaffId,
    setSelectedStaffId,
    detailsModalService,
    setDetailsModalService,
    date,
    setDate,
    time,
    setTime,
    name,
    setName,
    phone,
    setPhone,
    countryCode,
    setCountryCode,
    email,
    setEmail,
    paymentMethod,
    setPaymentMethod,
    amountPaid,
    setAmountPaid,
    fileName,
    filePreview,
    submitted,
    isSubmitting,
    isChangingService,
    setIsChangingService,
    selectedService,
    payCurrency,
    fullPrice,
    minDeposit,
    availableMethods,
    selectedMethodInfo,
    handleSubmit,
    handleFileUpload
  } = flow;

  const inputClass = "w-full bg-[#F9F6F0] border-b-2 border-[#E5DFD3] p-4 outline-none focus:border-primary transition-all font-light text-[#3D372F] rounded-none";

  // Navigation from TemplateSpa
  const renderNav = () => null;

  if (!services || services.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-[#5C5447] font-sans">
        {renderNav()}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-700">
          <h2 className="text-3xl font-light text-[#3D372F] mb-3">Aucun Service</h2>
          <p className="font-light max-w-md mb-8">
            Ce salon n'a pas encore ajouté de services à réserver. Veuillez repasser plus tard !
          </p>
          <Link href="/" className="border border-[#3D372F] text-[#3D372F] px-8 py-3 rounded-full hover:bg-[#3D372F] hover:text-white transition-all duration-300">
            Retour à l'accueil
          </Link>
        </div>
        
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F6F0] font-sans text-[#5C5447]">
        {renderNav()}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-700">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
            <CheckCircle2 className="w-10 h-10 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-6 text-[#3D372F]">{t("book.successTitle")}</h1>
          <p className="text-lg font-light text-[#7A7265] max-w-lg mb-12 leading-relaxed">
            {t("book.successDesc")}
          </p>
          <Link href="/" className="bg-[#3D372F] text-white px-10 py-4 rounded-full font-light tracking-wide hover:opacity-90 transition-opacity">
            {t("book.returnHome")}
          </Link>
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F0] font-sans text-[#5C5447]">
      {/* Short banner just to hold the nav visually */}
      <div className="w-full h-[200px] relative">
        {settings.bannerUrl ? (
          <>
            <img src={settings.bannerUrl} alt="Banner" className="absolute inset-0 w-full h-full object-cover z-0" />
            <div className="absolute inset-0 bg-black/40 z-0" />
          </>
        ) : (
          <div className="absolute inset-0 bg-primary/20 -z-10" />
        )}
        {renderNav()}
      </div>
      
      <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-16 -mt-20 relative z-10">
        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-light mb-2 text-[#3D372F]">{t("book.title")}</h1>
            <p className="text-sm font-light text-primary uppercase tracking-widest">Étape {step} sur 3</p>
          </div>

          {/* Progress Line */}
          <div className="flex items-center justify-center mb-16 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-3 h-3 rounded-full transition-all duration-500 ${step >= i ? "bg-[#3D372F]" : "bg-[#E5DFD3]"}`}></div>
                {i < 3 && <div className={`w-12 h-px transition-all duration-500 mx-2 ${step > i ? "bg-[#3D372F]" : "bg-[#E5DFD3]"}`}></div>}
              </div>
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-12 animate-in fade-in duration-700">
              {/* Service selector */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-[#E5DFD3] pb-2">
                  <label className="block text-xs uppercase tracking-widest text-[#7A7265]">Service sélectionné</label>
                  {!isChangingService && (
                    <button onClick={() => setIsChangingService(true)} className="text-xs uppercase tracking-widest text-primary hover:text-[#3D372F] transition-colors">
                      Changer
                    </button>
                  )}
                </div>
                
                {isChangingService ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    {services.map((s) => (
                      <div key={s.id} role="button" tabIndex={0} onClick={() => { setSelectedServiceId(s.id); setDate(""); setTime(""); setIsChangingService(false); }}
                        className={`flex flex-col text-left overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${selectedServiceId === s.id ? "border-primary bg-[#F9F6F0]" : "border-transparent hover:border-[#E5DFD3] bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]"}`}>
                        {s.imageUrl && (
                          <div className="w-full h-24 bg-[#F9F6F0] relative">
                            <Image src={s.imageUrl} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover opacity-90" alt={s.name} />
                          </div>
                        )}
                        <div className="p-4 flex-1 flex flex-col justify-between w-full">
                          <div className="space-y-1 mb-4">
                            <p className="font-medium text-[#3D372F] leading-tight">{s.name}</p>
                            <p className="text-xs font-light text-[#7A7265]">{s.duration}</p>
                          </div>
                          <div className="flex justify-between items-end mt-auto">
                            <p className="text-lg font-light text-[#3D372F]">${s.priceUSD}</p>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setDetailsModalService(s); }} className="text-xs text-[#7A7265] hover:text-primary transition-colors">
                              Détails
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  selectedService && (
                    <div className="flex flex-col sm:flex-row text-left overflow-hidden rounded-2xl border border-[#E5DFD3] bg-white">
                      {selectedService.imageUrl && (
                        <div className="w-full sm:w-40 h-32 sm:h-auto bg-[#F9F6F0] relative shrink-0">
                          <Image src={selectedService.imageUrl} fill sizes="(max-width: 640px) 100vw, 160px" className="object-cover opacity-90" alt={selectedService.name} />
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col justify-between w-full">
                        <div className="space-y-1">
                          <p className="font-medium text-lg text-[#3D372F] leading-tight">{selectedService.name}</p>
                          <p className="text-xs font-light uppercase tracking-widest text-primary">{selectedService.category}</p>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                          <p className="text-xl font-light text-[#3D372F]">${selectedService.priceUSD}</p>
                          <p className="text-xs font-light text-[#7A7265]">{selectedService.duration}</p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Staff Selector */}
              {staffList.length > 0 && (
                <div className="space-y-6">
                  <label className="block text-xs uppercase tracking-widest text-[#7A7265] border-b border-[#E5DFD3] pb-2">{t("book.staffLabel")}</label>
                  <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
                    <div role="button" tabIndex={0} onClick={() => { setSelectedStaffId("any"); setDate(""); setTime(""); }}
                      className={`flex-shrink-0 w-24 h-24 flex flex-col items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${selectedStaffId === "any" ? "border-primary bg-[#F9F6F0]" : "border-transparent hover:border-[#E5DFD3] bg-white shadow-[0_4px_15px_rgb(0,0,0,0.03)]"}`}>
                      <User className="w-6 h-6 mb-2 text-[#7A7265]" strokeWidth={1.5} />
                      <span className="font-light text-xs text-[#3D372F]">{t("book.anyStaff")}</span>
                    </div>
                    {staffList.map(staff => (
                      <div key={staff.id} role="button" tabIndex={0} onClick={() => { setSelectedStaffId(staff.id); setDate(""); setTime(""); }}
                        className={`flex-shrink-0 w-24 h-24 flex flex-col items-center justify-center rounded-full border transition-all duration-300 cursor-pointer relative overflow-hidden ${selectedStaffId === staff.id ? "border-primary ring-4 ring-primary/10" : "border-transparent hover:border-[#E5DFD3] shadow-[0_4px_15px_rgb(0,0,0,0.03)]"}`}>
                        {staff.imageUrl ? (
                          <>
                            <Image src={staff.imageUrl} fill sizes="96px" className="object-cover opacity-80" alt={staff.name} />
                            <div className="absolute inset-0 bg-black/20" />
                            <span className="font-light text-xs text-white z-10 drop-shadow-md text-center px-2">{staff.name}</span>
                          </>
                        ) : (
                          <>
                            <User className="w-6 h-6 mb-2 text-[#7A7265]" strokeWidth={1.5} />
                            <span className="font-light text-xs text-[#3D372F] text-center px-2">{staff.name}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Week Calendar */}
              <div className="space-y-6">
                <label className="block text-xs uppercase tracking-widest text-[#7A7265] border-b border-[#E5DFD3] pb-2">{t("book.selectDate")}</label>
                {selectedService && (
                  <WeekCalendar
                    serviceDuration={selectedService.duration}
                    settings={settings}
                    appointments={appointments}
                    services={services}
                    selectedDate={date}
                    selectedTime={time}
                    onSelect={(d, t) => { setDate(d); setTime(t); }}
                    language={language}
                  />
                )}
              </div>

              <button disabled={!date || !time} onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-3 bg-[#3D372F] text-white p-4 rounded-full font-light tracking-wide disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black transition-all duration-300 mt-8">
                {t("book.next")}
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="space-y-6">
                <input placeholder={t("book.name")} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                <div className="flex gap-4">
                  <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-[#F9F6F0] border-b-2 border-[#E5DFD3] p-4 outline-none focus:border-primary transition-all font-light text-[#3D372F] min-w-[100px]">
                    <option value="+509">🇭🇹 +509</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+33">🇫🇷 +33</option>
                  </select>
                  <input placeholder={t("book.phone")} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`flex-1 ${inputClass}`} />
                </div>
                <input placeholder={t("book.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </div>
              <div className="flex gap-4 pt-8 border-t border-[#E5DFD3]">
                <button onClick={() => setStep(1)} className="flex-1 p-4 rounded-full border border-[#E5DFD3] font-light tracking-wide text-[#7A7265] hover:bg-[#F9F6F0] transition-colors">{t("book.back")}</button>
                <button disabled={!name || (!phone && !email)} onClick={() => setStep(3)}
                  className="flex-1 bg-[#3D372F] text-white p-4 rounded-full font-light tracking-wide hover:bg-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed">
                  {t("book.next")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && selectedService && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
              {/* Payment Method Selector */}
              <div className="space-y-6">
                <label className="block text-xs uppercase tracking-widest text-[#7A7265] border-b border-[#E5DFD3] pb-2">{t("book.methodLabel")}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableMethods.map((m) => (
                    <button key={m.key} onClick={() => setPaymentMethod(m.key)}
                      className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-1 ${paymentMethod === m.key ? "bg-[#F9F6F0] border-[#3D372F] text-[#3D372F]" : "bg-white border-[#E5DFD3] text-[#7A7265] hover:border-[#3D372F]/30"}`}>
                      <span className="font-medium text-sm">{m.label}</span>
                      <span className="text-xs font-light">{m.currency}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Deposit Info */}
              {selectedMethodInfo && (
                <div className="bg-[#F9F6F0] rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-[#E5DFD3]">
                    <span className="text-[#7A7265] font-light">{t("book.totalPrice")}</span>
                    <span className="text-xl font-medium text-[#3D372F]">
                      {payCurrency === "HTG" ? `${fullPrice.toLocaleString()} HTG` : `$${fullPrice}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#3D372F] font-medium flex flex-col sm:flex-row sm:items-center gap-2">
                      {t("book.minDeposit")}
                    </span>
                    <span className="text-2xl font-light text-primary">
                      {payCurrency === "HTG" ? `${minDeposit.toLocaleString()} HTG` : `$${minDeposit}`}
                    </span>
                  </div>

                  <p className="text-sm text-[#7A7265] font-light leading-relaxed">
                    {t("book.payInfo")}
                  </p>

                  {/* Payment destination */}
                  <div className="bg-white p-5 rounded-2xl font-light text-base text-center shadow-sm">
                    <span className="text-[#7A7265]">{selectedMethodInfo.label}:</span> <span className="font-medium text-[#3D372F]">{selectedMethodInfo.info}</span>
                  </div>

                  {/* Amount field */}
                  <div className="space-y-4 pt-4 border-t border-[#E5DFD3]">
                    <label className="block text-xs uppercase tracking-widest text-[#7A7265]">{t("book.amountSent")} ({payCurrency})</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={`Min. ${minDeposit.toLocaleString()}`}
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        className="w-full bg-white border border-[#E5DFD3] rounded-2xl p-4 pr-20 outline-none focus:border-primary transition-all font-medium text-lg text-[#3D372F]"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 font-light text-[#7A7265]">{payCurrency}</span>
                    </div>
                  </div>

                  {/* Screenshot Upload */}
                  <div className="pt-2">
                    <label className="relative flex flex-col items-center justify-center w-full min-h-[140px] py-8 border border-dashed border-[#E5DFD3] rounded-2xl cursor-pointer hover:bg-white transition-colors bg-transparent overflow-hidden group">
                      {filePreview ? (
                        <>
                          <Image src={filePreview} alt="Preview" fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                          <div className="z-10 flex flex-col items-center justify-center p-3 rounded-xl bg-white/80 backdrop-blur-sm text-center">
                            <CheckCircle2 className="text-[#3D372F] w-8 h-8 mb-1 mx-auto" strokeWidth={1.5} />
                            <span className="font-light text-xs text-[#3D372F] max-w-[180px] truncate">{fileName}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="text-[#7A7265] w-8 h-8 mb-3" strokeWidth={1.5} />
                          <span className="font-light text-sm text-[#7A7265] text-center px-4">{fileName ? fileName : t("book.upload")}</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-8 border-t border-[#E5DFD3]">
                <button onClick={() => setStep(2)} className="flex-1 p-4 rounded-full border border-[#E5DFD3] font-light tracking-wide text-[#7A7265] hover:bg-[#F9F6F0] transition-colors">{t("book.back")}</button>
                <button
                  disabled={!fileName || !amountPaid || isSubmitting}
                  onClick={handleSubmit}
                  className="flex-[2] flex items-center justify-center gap-2 bg-[#3D372F] text-white p-4 rounded-full font-light tracking-wide hover:bg-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>{t("book.confirm")}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {detailsModalService && (
        <div className="fixed inset-0 z-50 bg-[#3D372F]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-[0_20px_60px_rgb(0,0,0,0.1)] relative">
            <button onClick={() => setDetailsModalService(null)} className="absolute top-4 right-4 bg-white/80 text-[#3D372F] rounded-full p-2 hover:bg-[#F9F6F0] transition-colors z-10">
              <X size={20} strokeWidth={1.5} />
            </button>
            {detailsModalService.imageUrl && (
              <div className="relative w-full h-64 bg-[#F9F6F0]">
                <Image src={detailsModalService.imageUrl} alt={detailsModalService.name} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover opacity-90" />
              </div>
            )}
            <div className="p-8 md:p-12 space-y-6">
              <div>
                <h3 className="text-2xl font-light text-[#3D372F] leading-tight mb-2">{detailsModalService.name}</h3>
                {detailsModalService.category && (
                  <span className="inline-block text-xs font-light text-[#7A7265] uppercase tracking-widest">{detailsModalService.category}</span>
                )}
              </div>
              
              {detailsModalService.description ? (
                <div className="text-[#7A7265] font-light leading-relaxed whitespace-pre-wrap">
                  {detailsModalService.description}
                </div>
              ) : (
                <p className="text-[#E5DFD3] italic font-light">Aucune description disponible.</p>
              )}

              <div className="border-t border-[#E5DFD3] pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="w-full sm:w-auto text-center sm:text-left">
                  <p className="text-xs uppercase tracking-widest text-[#7A7265] mb-2">Durée & Prix</p>
                  <p className="font-light text-[#3D372F] text-lg">{detailsModalService.duration} <span className="mx-2 text-[#E5DFD3]">|</span> <span className="text-xl">${detailsModalService.priceUSD} <span className="text-sm opacity-70 ml-2 font-bold whitespace-nowrap">/ {detailsModalService.priceHTG.toLocaleString()} HTG</span></span></p>
                </div>
                <div className="flex w-full sm:w-auto gap-3">
                  {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center border border-[#E5DFD3] text-[#7A7265] px-4 rounded-full hover:bg-[#F9F6F0] transition-colors">
                      <MessageCircle size={18} strokeWidth={1.5} />
                    </a>
                  )}
                  <button onClick={() => { setSelectedServiceId(detailsModalService.id); setDate(""); setTime(""); setDetailsModalService(null); }} 
                    className="flex-1 sm:flex-none bg-[#3D372F] text-white px-8 py-3 rounded-full font-light tracking-wide hover:bg-black transition-all">
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
