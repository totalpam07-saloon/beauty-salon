import { ArrowRight, CheckCircle2, ChevronDown, MessageCircle, User, Upload, X } from "lucide-react";
import { WeekCalendar } from "@/components/week-calendar";
import Link from "next/link";
import Image from "next/image";
import { Service, SalonSettings, Appointment, Staff } from "@/store/salon";
import { useBookingFlow } from "./useBookingFlow";
export function BookingLuxe({
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

  const inputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-none p-5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-light tracking-wide text-zinc-100";

  // Navigation from TemplateLuxe
  const renderNav = () => null;

  if (!services || services.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 font-sans text-zinc-100">
        {renderNav()}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-700 mt-20">
          <h2 className="text-3xl font-serif uppercase tracking-widest text-zinc-100 mb-3">Aucun Service</h2>
          <p className="text-zinc-500 font-light max-w-md mb-8">
            Ce salon n'a pas encore ajouté de services à réserver. Veuillez repasser plus tard !
          </p>
          <Link href="/" className="border border-zinc-100 text-zinc-100 px-8 py-4 uppercase tracking-widest text-sm hover:bg-zinc-100 hover:text-zinc-950 transition-all duration-500">
            Retour à l'accueil
          </Link>
        </div>
        
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 font-sans text-zinc-100">
        {renderNav()}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-700 mt-20">
          <div className="w-32 h-32 border border-primary/30 flex items-center justify-center mb-8 relative">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-6 text-zinc-100">{t("book.successTitle")}</h1>
          <p className="text-lg md:text-xl font-light text-zinc-400 max-w-lg mb-10 leading-relaxed">
            {t("book.successDesc")}
          </p>
          <Link href="/" className="bg-primary text-primary-foreground px-10 py-5 uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-500">
            {t("book.returnHome")}
          </Link>
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 font-sans text-zinc-100 selection:bg-primary/30 selection:text-white">
      {renderNav()}
      
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-24 md:py-32">
        <h1 className="text-3xl md:text-5xl font-serif uppercase tracking-widest mb-16 text-center text-zinc-100">{t("book.title")}</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-16 relative px-4 max-w-md mx-auto">
          <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-zinc-800 -z-10 -translate-y-1/2"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-12 h-12 flex items-center justify-center font-serif text-lg transition-all duration-500 ${step >= i ? "bg-primary text-primary-foreground border border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] scale-110" : "bg-zinc-950 border border-zinc-800 text-zinc-600"}`}>
              {i}
            </div>
          ))}
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-6 md:p-12 shadow-2xl relative">
          {/* Decorative corner borders */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-zinc-700/50"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-zinc-700/50"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-zinc-700/50"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-zinc-700/50"></div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <h2 className="text-2xl font-serif uppercase tracking-widest text-zinc-100 text-center">{t("book.step1")}</h2>
              <div className="w-12 h-px bg-primary mx-auto mb-10"></div>

              {/* Service selector */}
              <div className="space-y-6">
                <div className="flex justify-between items-center ml-1 pr-1 border-b border-zinc-800 pb-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Service</label>
                  {!isChangingService && (
                    <button onClick={() => setIsChangingService(true)} className="text-xs uppercase tracking-widest text-primary hover:text-white transition-colors">
                      Changer
                    </button>
                  )}
                </div>
                
                {isChangingService ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    {services.map((s) => (
                      <div key={s.id} role="button" tabIndex={0} onClick={() => { setSelectedServiceId(s.id); setDate(""); setTime(""); setIsChangingService(false); }}
                        className={`flex flex-col text-left overflow-hidden border transition-all duration-300 cursor-pointer ${selectedServiceId === s.id ? "border-primary bg-primary/5" : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/50"}`}>
                        {s.imageUrl && (
                          <div className="w-full h-32 bg-zinc-900 relative">
                            <Image src={s.imageUrl} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover opacity-70" alt={s.name} />
                            {selectedServiceId === s.id && (
                              <div className="absolute top-2 right-2 bg-primary text-white p-1">
                                <CheckCircle2 size={16} />
                              </div>
                            )}
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col justify-between w-full">
                          <div className="space-y-2 mb-6">
                            <p className="font-serif uppercase tracking-wide text-zinc-100 leading-tight">{s.name}</p>
                            <p className="text-xs font-light text-zinc-500 uppercase tracking-widest">{s.duration}</p>
                          </div>
                          <div className="flex justify-between items-end mt-auto">
                            <p className="font-serif text-lg text-primary">${s.priceUSD} <span className="text-[10px] text-zinc-600 tracking-wider ml-1">{s.priceHTG.toLocaleString()} HTG</span></p>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setDetailsModalService(s); }} className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                              Détails
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  selectedService && (
                    <div className="flex flex-col sm:flex-row text-left overflow-hidden border border-primary bg-primary/5">
                      {selectedService.imageUrl && (
                        <div className="w-full sm:w-48 h-40 sm:h-auto bg-zinc-900 relative shrink-0">
                          <Image src={selectedService.imageUrl} fill sizes="(max-width: 640px) 100vw, 192px" className="object-cover opacity-80" alt={selectedService.name} />
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col justify-between w-full">
                        <div className="space-y-2">
                          <p className="font-serif text-xl uppercase tracking-widest text-zinc-100 leading-tight">{selectedService.name}</p>
                          <p className="text-xs font-light uppercase tracking-widest text-primary">{selectedService.category}</p>
                        </div>
                        <div className="flex justify-between items-end mt-6">
                          <p className="font-serif text-xl text-primary">${selectedService.priceUSD} <span className="text-xs text-zinc-500 font-light ml-1 tracking-wider">{selectedService.priceHTG.toLocaleString()} HTG</span></p>
                          <p className="text-xs uppercase tracking-widest text-zinc-400 border border-zinc-800 px-3 py-1.5">{selectedService.duration}</p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Staff Selector */}
              {staffList.length > 0 && (
                <div className="space-y-6">
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1 border-b border-zinc-800 pb-2">{t("book.staffLabel")}</label>
                  <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar px-1">
                    <div role="button" tabIndex={0} onClick={() => { setSelectedStaffId("any"); setDate(""); setTime(""); }}
                      className={`flex-shrink-0 w-28 h-28 flex flex-col items-center justify-center border transition-all duration-300 cursor-pointer ${selectedStaffId === "any" ? "border-primary bg-primary/5" : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/50"}`}>
                      <User className={`w-8 h-8 mb-3 ${selectedStaffId === "any" ? "text-primary" : "text-zinc-600"}`} />
                      <span className="font-light text-xs uppercase tracking-widest text-zinc-300">{t("book.anyStaff")}</span>
                    </div>
                    {staffList.map(staff => (
                      <div key={staff.id} role="button" tabIndex={0} onClick={() => { setSelectedStaffId(staff.id); setDate(""); setTime(""); }}
                        className={`flex-shrink-0 w-28 h-28 flex flex-col items-center justify-center border transition-all duration-300 cursor-pointer relative overflow-hidden ${selectedStaffId === staff.id ? "border-primary" : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/50"}`}>
                        {staff.imageUrl ? (
                          <>
                            <Image src={staff.imageUrl} fill sizes="112px" className="object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-500" alt={staff.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent" />
                            <span className="font-light text-xs uppercase tracking-widest text-zinc-100 z-10 mt-auto mb-3 text-center px-2">{staff.name}</span>
                            {selectedStaffId === staff.id && (
                              <div className="absolute top-2 right-2 bg-primary text-white p-0.5 z-10">
                                <CheckCircle2 size={12} />
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <User className={`w-8 h-8 mb-3 ${selectedStaffId === staff.id ? "text-primary" : "text-zinc-600"}`} />
                            <span className="font-light text-xs uppercase tracking-widest text-zinc-300 text-center px-2">{staff.name}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Week Calendar */}
              <div className="space-y-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1 border-b border-zinc-800 pb-2">{t("book.selectDate")}</label>
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
                className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground p-5 font-serif uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:text-black transition-all duration-500 text-sm mt-8 border border-primary">
                {t("book.next")} <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
              <h2 className="text-2xl font-serif uppercase tracking-widest text-zinc-100 text-center">{t("book.step2")}</h2>
              <div className="w-12 h-px bg-primary mx-auto mb-10"></div>
              
              <div className="space-y-6">
                <input placeholder={t("book.name")} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                <div className="flex gap-4">
                  <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 p-5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-light tracking-widest text-zinc-100 min-w-[120px]">
                    <option value="+509">🇭🇹 +509</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+33">🇫🇷 +33</option>
                  </select>
                  <input placeholder={t("book.phone")} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`flex-1 ${inputClass}`} />
                </div>
                <input placeholder={t("book.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </div>
              <div className="flex gap-4 pt-8 border-t border-zinc-900">
                <button onClick={() => setStep(1)} className="flex-1 p-5 border border-zinc-800 font-serif uppercase tracking-widest text-sm hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-zinc-100">{t("book.back")}</button>
                <button disabled={!name || (!phone && !email)} onClick={() => setStep(3)}
                  className="flex-1 bg-primary text-primary-foreground p-5 border border-primary font-serif uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed">
                  {t("book.next")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && selectedService && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
              <h2 className="text-2xl font-serif uppercase tracking-widest text-zinc-100 text-center">{t("book.step3")}</h2>
              <div className="w-12 h-px bg-primary mx-auto mb-10"></div>

              {/* Payment Method Selector */}
              <div className="space-y-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1 border-b border-zinc-800 pb-2">{t("book.methodLabel")}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {availableMethods.map((m) => (
                    <button key={m.key} onClick={() => setPaymentMethod(m.key)}
                      className={`p-5 border transition-all duration-500 flex flex-col items-center gap-2 ${paymentMethod === m.key ? "bg-primary/10 border-primary text-primary" : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 text-zinc-400"}`}>
                      <span className="font-serif tracking-widest uppercase text-sm">{m.label}</span>
                      <span className={`text-[10px] tracking-wider ${paymentMethod === m.key ? "text-primary/70" : "text-zinc-600"}`}>{m.currency}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Deposit Info */}
              {selectedMethodInfo && (
                <div className="bg-zinc-900/50 border border-zinc-800 p-8 space-y-8 relative">
                  <div className="flex justify-between items-center pb-6 border-b border-zinc-800/50">
                    <span className="text-zinc-500 font-light uppercase tracking-widest text-xs">{t("book.totalPrice")}</span>
                    <span className="text-xl font-serif text-zinc-100">
                      {payCurrency === "HTG" ? `${fullPrice.toLocaleString()} HTG` : `$${fullPrice}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 font-light uppercase tracking-widest text-xs flex flex-col sm:flex-row sm:items-center gap-2">
                      {t("book.minDeposit")}
                      {selectedService.depositType === "percentage" && (
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 ml-0 sm:ml-2">{selectedService.depositPercentage}%</span>
                      )}
                    </span>
                    <span className="text-2xl font-serif text-primary">
                      {payCurrency === "HTG" ? `${minDeposit.toLocaleString()} HTG` : `$${minDeposit}`}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 font-light tracking-wide leading-relaxed">
                    {t("book.payInfo")}
                  </p>

                  {/* Payment destination */}
                  <div className="bg-zinc-950 p-6 border border-zinc-800 font-serif tracking-wider text-base text-center">
                    <span className="text-zinc-500 text-xs uppercase block mb-2">{selectedMethodInfo.label}</span>
                    <span className="text-zinc-100 text-xl">{selectedMethodInfo.info}</span>
                  </div>

                  {/* Amount field */}
                  <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">{t("book.amountSent")} ({payCurrency})</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={`Min. ${minDeposit.toLocaleString()}`}
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        className={`${inputClass} pr-20`}
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 font-serif text-zinc-500">{payCurrency}</span>
                    </div>
                  </div>

                  {/* Screenshot Upload */}
                  <div className="pt-4">
                    <label className="relative flex flex-col items-center justify-center w-full min-h-[160px] py-10 border border-dashed border-zinc-700 cursor-pointer hover:border-primary transition-colors bg-zinc-950/50 overflow-hidden group">
                      {filePreview ? (
                        <>
                          <Image src={filePreview} alt="Preview" fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover opacity-40 group-hover:opacity-20 transition-opacity" />
                          <div className="z-10 flex flex-col items-center justify-center p-4 text-center">
                            <CheckCircle2 className="text-primary w-10 h-10 mb-3 mx-auto" />
                            <span className="font-light tracking-wider text-xs text-zinc-100 max-w-[180px] truncate">{fileName}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="text-zinc-600 w-10 h-10 mb-4 group-hover:text-primary transition-colors duration-500" />
                          <span className="font-light uppercase tracking-widest text-xs text-zinc-400 text-center px-4 group-hover:text-zinc-200 transition-colors">{fileName ? fileName : t("book.upload")}</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-8 border-t border-zinc-900">
                <button onClick={() => setStep(2)} className="flex-1 p-5 border border-zinc-800 font-serif uppercase tracking-widest text-sm hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-zinc-100">{t("book.back")}</button>
                <button
                  disabled={!fileName || !amountPaid || isSubmitting}
                  onClick={handleSubmit}
                  className="flex-[2] flex items-center justify-center gap-3 bg-primary text-primary-foreground p-5 border border-primary font-serif uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><CheckCircle2 size={18} /> {t("book.confirm")}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {detailsModalService && (
        <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-zinc-800 max-w-xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl relative">
            <button onClick={() => setDetailsModalService(null)} className="absolute top-4 right-4 bg-zinc-900 text-zinc-400 hover:text-zinc-100 p-2 transition-colors z-10 border border-zinc-800">
              <X size={20} />
            </button>
            {detailsModalService.imageUrl && (
              <div className="relative w-full h-72 bg-zinc-900">
                <Image src={detailsModalService.imageUrl} alt={detailsModalService.name} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
              </div>
            )}
            <div className={`p-8 md:p-12 space-y-8 ${!detailsModalService.imageUrl ? 'pt-16' : '-mt-16 relative z-10'}`}>
              <div>
                <h3 className="text-3xl font-serif uppercase tracking-widest text-zinc-100 leading-tight mb-4">{detailsModalService.name}</h3>
                {detailsModalService.category && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] bg-zinc-900 border border-zinc-800 text-primary px-3 py-1">{detailsModalService.category}</span>
                )}
              </div>
              
              {detailsModalService.description ? (
                <div className="text-zinc-400 font-light leading-relaxed whitespace-pre-wrap tracking-wide">
                  {detailsModalService.description}
                </div>
              ) : (
                <p className="text-zinc-600 italic font-light tracking-wide">Aucune description disponible.</p>
              )}

              <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="w-full sm:w-auto text-center sm:text-left">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Durée & Prix</p>
                  <p className="font-light text-zinc-300 tracking-wider">{detailsModalService.duration} <span className="mx-2 text-zinc-700">|</span> <span className="text-2xl font-serif text-primary">${detailsModalService.priceUSD} <span className="text-sm opacity-70 ml-2 font-bold whitespace-nowrap">/ {detailsModalService.priceHTG.toLocaleString()} HTG</span></span></p>
                </div>
                <div className="flex w-full sm:w-auto gap-4">
                  {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-400 px-5 hover:text-white transition-colors">
                      <MessageCircle size={18} />
                    </a>
                  )}
                  <button onClick={() => { setSelectedServiceId(detailsModalService.id); setDate(""); setTime(""); setDetailsModalService(null); }} 
                    className="flex-1 sm:flex-none bg-primary text-primary-foreground px-8 py-4 font-serif uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-500 border border-primary">
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
