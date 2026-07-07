import { ArrowRight, CheckCircle2, ChevronDown, MessageCircle, User, Upload, X } from "lucide-react";
import { WeekCalendar } from "@/components/week-calendar";
import Link from "next/link";
import Image from "next/image";
import { Service, SalonSettings, Appointment, Staff } from "@/store/salon";
import { useBookingFlow } from "./useBookingFlow";
export function BookingEditorial({
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

  const inputClass = "w-full bg-white border-b border-black p-4 outline-none focus:border-primary transition-all font-serif text-black placeholder:text-black/30 placeholder:font-sans uppercase tracking-wider";

  // Navigation from TemplateEditorial
  const renderNav = () => null;

  if (!services || services.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-sans text-black">
        {renderNav()}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-700 mt-24">
          <h2 className="text-5xl font-serif uppercase tracking-tighter mb-6">Aucun Service</h2>
          <p className="text-black/60 font-light max-w-md mb-12 uppercase tracking-widest text-sm leading-relaxed">
            Ce salon n'a pas encore ajouté de services à réserver. Veuillez repasser plus tard.
          </p>
          <Link href="/" className="border border-black text-black px-12 py-5 uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-all duration-500">
            Retour à l'accueil
          </Link>
        </div>
        
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-sans text-black">
        {renderNav()}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-700 mt-24">
          <div className="w-32 h-32 border border-black/10 flex items-center justify-center mb-12">
            <CheckCircle2 className="w-12 h-12 text-black" strokeWidth={1} />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif uppercase tracking-tighter mb-8">{t("book.successTitle")}</h1>
          <p className="text-xl font-light text-black/60 max-w-lg mb-12 uppercase tracking-widest leading-relaxed">
            {t("book.successDesc")}
          </p>
          <Link href="/" className="bg-black text-white px-12 py-5 uppercase tracking-widest text-sm hover:bg-white hover:text-black border border-black transition-all duration-500">
            {t("book.returnHome")}
          </Link>
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black selection:bg-black selection:text-white">
      {renderNav()}
      
      <div className="flex-1 w-full max-w-[1000px] mx-auto px-6 py-32 md:py-48">
        <h1 className="text-4xl md:text-7xl font-serif uppercase tracking-tighter mb-20 text-center">{t("book.title")}</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-24 relative px-4 max-w-lg mx-auto">
          <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-black/10 -z-10 -translate-y-1/2"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-14 h-14 flex items-center justify-center font-serif text-xl transition-all duration-500 ${step >= i ? "bg-black text-white scale-110" : "bg-white border border-black/20 text-black/40"}`}>
              {String(i).padStart(2, '0')}
            </div>
          ))}
        </div>

        <div className="border border-black p-8 md:p-16 relative bg-white">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-16 animate-in fade-in duration-700">
              <div className="flex items-center gap-6">
                <span className="font-serif text-4xl text-black/20">01</span>
                <h2 className="text-2xl font-serif uppercase tracking-widest">{t("book.step1")}</h2>
              </div>

              {/* Service selector */}
              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-black pb-4">
                  <label className="block text-sm uppercase tracking-[0.2em] text-black/50">Service</label>
                  {!isChangingService && (
                    <button onClick={() => setIsChangingService(true)} className="text-xs uppercase tracking-widest text-black hover:opacity-50 transition-colors">
                      [ Changer ]
                    </button>
                  )}
                </div>
                
                {isChangingService ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                    {services.map((s, idx) => (
                      <div key={s.id} role="button" tabIndex={0} onClick={() => { setSelectedServiceId(s.id); setDate(""); setTime(""); setIsChangingService(false); }}
                        className={`flex flex-col text-left group cursor-pointer ${selectedServiceId === s.id ? "" : ""}`}>
                        {s.imageUrl && (
                          <div className="w-full aspect-[4/3] bg-zinc-100 relative mb-4 overflow-hidden">
                            <Image src={s.imageUrl} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={s.name} />
                            {selectedServiceId === s.id && (
                              <div className="absolute inset-0 border-4 border-black pointer-events-none" />
                            )}
                            <div className="absolute top-4 left-4 bg-white text-black text-xs font-serif px-2 py-1 uppercase tracking-widest">
                              No. {String(idx + 1).padStart(2, '0')}
                            </div>
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-between w-full">
                          <h3 className="font-serif text-xl uppercase tracking-wide mb-2">{s.name}</h3>
                          <div className="w-full h-px bg-black/10 my-3"></div>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-light text-black/60 uppercase tracking-widest">{s.duration}</span>
                            <span className="text-lg font-serif">${s.priceUSD}</span>
                          </div>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setDetailsModalService(s); }} className="text-xs uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors w-full text-center border border-black/10 py-3 group-hover:border-black">
                            Détails
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  selectedService && (
                    <div className="flex flex-col sm:flex-row text-left overflow-hidden border border-black group">
                      {selectedService.imageUrl && (
                        <div className="w-full sm:w-1/3 aspect-square sm:aspect-auto bg-zinc-100 relative shrink-0 overflow-hidden">
                          <Image src={selectedService.imageUrl} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={selectedService.name} />
                        </div>
                      )}
                      <div className="p-8 md:p-10 flex-1 flex flex-col justify-between w-full bg-white">
                        <div className="space-y-4 mb-8">
                          <p className="text-xs font-light uppercase tracking-[0.2em] text-black/50">{selectedService.category}</p>
                          <p className="font-serif text-3xl uppercase tracking-widest leading-tight">{selectedService.name}</p>
                        </div>
                        <div className="flex justify-between items-end border-t border-black/10 pt-6">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/40 mb-1">Price</p>
                            <p className="font-serif text-2xl">${selectedService.priceUSD} <span className="text-xs font-sans text-black/40 tracking-widest ml-2">{selectedService.priceHTG.toLocaleString()} HTG</span></p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs uppercase tracking-[0.2em] text-black/40 mb-1">Time</p>
                            <p className="text-sm uppercase tracking-widest">{selectedService.duration}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Staff Selector */}
              {staffList.length > 0 && (
                <div className="space-y-8">
                  <label className="block text-sm uppercase tracking-[0.2em] text-black/50 border-b border-black pb-4">{t("book.staffLabel")}</label>
                  <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar">
                    <div role="button" tabIndex={0} onClick={() => { setSelectedStaffId("any"); setDate(""); setTime(""); }}
                      className={`flex-shrink-0 w-32 flex flex-col items-center justify-center cursor-pointer group`}>
                      <div className={`w-32 h-40 border flex items-center justify-center mb-4 transition-all duration-500 ${selectedStaffId === "any" ? "border-black bg-black/5" : "border-black/20 group-hover:border-black"}`}>
                        <User className="w-8 h-8 text-black/40" strokeWidth={1} />
                      </div>
                      <span className="font-serif text-xs uppercase tracking-widest text-black text-center">{t("book.anyStaff")}</span>
                    </div>
                    {staffList.map(staff => (
                      <div key={staff.id} role="button" tabIndex={0} onClick={() => { setSelectedStaffId(staff.id); setDate(""); setTime(""); }}
                        className={`flex-shrink-0 w-32 flex flex-col items-center justify-center cursor-pointer group`}>
                        <div className={`w-32 h-40 relative overflow-hidden mb-4 transition-all duration-500 ${selectedStaffId === staff.id ? "border-4 border-black" : "border border-black/20 group-hover:border-black"}`}>
                          {staff.imageUrl ? (
                            <Image src={staff.imageUrl} fill sizes="128px" className={`object-cover ${selectedStaffId === staff.id ? "grayscale-0" : "grayscale"} group-hover:grayscale-0 transition-all duration-700`} alt={staff.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                              <User className="w-8 h-8 text-black/40" strokeWidth={1} />
                            </div>
                          )}
                        </div>
                        <span className="font-serif text-xs uppercase tracking-widest text-black text-center">{staff.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Week Calendar */}
              <div className="space-y-8">
                <label className="block text-sm uppercase tracking-[0.2em] text-black/50 border-b border-black pb-4">{t("book.selectDate")}</label>
                {selectedService && (
                  <div className="border border-black/10 p-6">
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
                  </div>
                )}
              </div>

              <div className="pt-8 flex justify-end">
                <button disabled={!date || !time} onClick={() => setStep(2)}
                  className="flex items-center gap-4 bg-black text-white px-12 py-5 font-serif uppercase tracking-widest text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/80 transition-colors group">
                  {t("book.next")} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="flex items-center gap-6">
                <span className="font-serif text-4xl text-black/20">02</span>
                <h2 className="text-2xl font-serif uppercase tracking-widest">{t("book.step2")}</h2>
              </div>
              
              <div className="space-y-10">
                <input placeholder={t("book.name")} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                <div className="flex gap-6">
                  <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-white border-b border-black p-4 outline-none focus:border-primary transition-all font-serif text-black uppercase tracking-widest min-w-[120px] appearance-none">
                    <option value="+509">HT +509</option>
                    <option value="+1">US +1</option>
                    <option value="+33">FR +33</option>
                  </select>
                  <input placeholder={t("book.phone")} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`flex-1 ${inputClass}`} />
                </div>
                <input placeholder={t("book.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t border-black/10">
                <button onClick={() => setStep(1)} className="flex-1 py-5 border border-black font-serif uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">{t("book.back")}</button>
                <button disabled={!name || (!phone && !email)} onClick={() => setStep(3)}
                  className="flex-[2] bg-black text-white py-5 border border-black font-serif uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed">
                  {t("book.next")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && selectedService && (
            <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="flex items-center gap-6">
                <span className="font-serif text-4xl text-black/20">03</span>
                <h2 className="text-2xl font-serif uppercase tracking-widest">{t("book.step3")}</h2>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-8">
                <label className="block text-sm uppercase tracking-[0.2em] text-black/50 border-b border-black pb-4">{t("book.methodLabel")}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {availableMethods.map((m) => (
                    <button key={m.key} onClick={() => setPaymentMethod(m.key)}
                      className={`p-6 border transition-all duration-500 flex flex-col items-center gap-3 ${paymentMethod === m.key ? "bg-black border-black text-white" : "bg-white border-black/20 hover:border-black text-black/60 hover:text-black"}`}>
                      <span className="font-serif tracking-widest uppercase text-sm">{m.label}</span>
                      <span className={`text-[10px] tracking-[0.2em] ${paymentMethod === m.key ? "text-white/50" : "text-black/40"}`}>{m.currency}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Deposit Info */}
              {selectedMethodInfo && (
                <div className="bg-zinc-50 border border-black/10 p-10 space-y-10">
                  <div className="flex justify-between items-end pb-6 border-b border-black/10">
                    <span className="text-black/50 uppercase tracking-[0.2em] text-xs">{t("book.totalPrice")}</span>
                    <span className="text-2xl font-serif text-black">
                      {payCurrency === "HTG" ? `${fullPrice.toLocaleString()} HTG` : `$${fullPrice}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-end">
                    <span className="text-black uppercase tracking-[0.2em] text-xs flex flex-col gap-2">
                      {t("book.minDeposit")}
                      {selectedService.depositType === "percentage" && (
                        <span className="text-[10px] bg-black text-white px-2 py-1 inline-block w-max">{selectedService.depositPercentage}%</span>
                      )}
                    </span>
                    <span className="text-4xl font-serif text-black">
                      {payCurrency === "HTG" ? `${minDeposit.toLocaleString()} HTG` : `$${minDeposit}`}
                    </span>
                  </div>

                  <p className="text-xs text-black/60 font-light tracking-widest leading-relaxed uppercase bg-white p-6 border border-black/10">
                    {t("book.payInfo")}
                  </p>

                  {/* Payment destination */}
                  <div className="bg-black p-8 font-serif tracking-widest text-base text-center text-white flex flex-col gap-2">
                    <span className="text-white/50 text-[10px] uppercase font-sans tracking-[0.2em]">{selectedMethodInfo.label}</span>
                    <span className="text-2xl">{selectedMethodInfo.info}</span>
                  </div>

                  {/* Amount field */}
                  <div className="space-y-6 pt-6 border-t border-black/10">
                    <label className="block text-xs uppercase tracking-[0.2em] text-black/50">{t("book.amountSent")} ({payCurrency})</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={`Min. ${minDeposit.toLocaleString()}`}
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-black p-4 pr-20 outline-none focus:border-primary transition-all font-serif text-2xl text-black placeholder:text-black/20"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-serif text-black/30">{payCurrency}</span>
                    </div>
                  </div>

                  {/* Screenshot Upload */}
                  <div className="pt-6">
                    <label className="relative flex flex-col items-center justify-center w-full min-h-[200px] py-12 border border-black cursor-pointer hover:bg-black hover:text-white transition-colors bg-white overflow-hidden group">
                      {filePreview ? (
                        <>
                          <Image src={filePreview} alt="Preview" fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover opacity-30 grayscale group-hover:opacity-10 transition-opacity" />
                          <div className="z-10 flex flex-col items-center justify-center p-6 text-center">
                            <CheckCircle2 className="w-10 h-10 mb-4 mx-auto" strokeWidth={1} />
                            <span className="font-sans uppercase tracking-[0.2em] text-xs max-w-[200px] truncate">{fileName}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-6 text-black group-hover:text-white transition-colors duration-500" strokeWidth={1} />
                          <span className="font-sans uppercase tracking-[0.2em] text-xs text-center px-4">{fileName ? fileName : t("book.upload")}</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t border-black/10">
                <button onClick={() => setStep(2)} className="flex-1 py-5 border border-black font-serif uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">{t("book.back")}</button>
                <button
                  disabled={!fileName || !amountPaid || isSubmitting}
                  onClick={handleSubmit}
                  className="flex-[2] flex items-center justify-center gap-4 bg-black text-white py-5 border border-black font-serif uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <div className="w-5 h-5 border border-white border-t-transparent rounded-full animate-spin" />
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
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-white border border-black max-w-3xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden relative flex flex-col md:flex-row">
            <button onClick={() => setDetailsModalService(null)} className="absolute top-6 right-6 bg-white border border-black text-black p-3 hover:bg-black hover:text-white transition-colors z-20">
              <X size={20} strokeWidth={1} />
            </button>
            {detailsModalService.imageUrl && (
              <div className="w-full md:w-2/5 h-64 md:h-auto bg-zinc-100 relative shrink-0">
                <Image src={detailsModalService.imageUrl} alt={detailsModalService.name} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover grayscale" />
              </div>
            )}
            <div className="p-10 md:p-16 space-y-10 flex-1 flex flex-col justify-center">
              <div>
                {detailsModalService.category && (
                  <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-black/50 mb-6">{detailsModalService.category}</span>
                )}
                <h3 className="text-4xl md:text-5xl font-serif uppercase tracking-tighter leading-none mb-8">{detailsModalService.name}</h3>
                <div className="w-12 h-px bg-black/20"></div>
              </div>
              
              {detailsModalService.description ? (
                <div className="text-black/70 font-light leading-relaxed whitespace-pre-wrap uppercase tracking-widest text-sm">
                  {detailsModalService.description}
                </div>
              ) : (
                <p className="text-black/30 italic font-serif text-xl">Aucune description disponible.</p>
              )}

              <div className="pt-10 flex flex-col gap-10">
                <div className="grid grid-cols-2 gap-8 border-t border-black/10 pt-10">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-2">Durée</p>
                    <p className="font-serif text-xl">{detailsModalService.duration}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-2">Prix</p>
                    <p className="font-serif text-3xl">${detailsModalService.priceUSD} <span className="text-sm opacity-70 ml-2 font-bold whitespace-nowrap">/ {detailsModalService.priceHTG.toLocaleString()} HTG</span></p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row w-full gap-4">
                  {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center bg-white border border-black text-black px-8 py-4 hover:bg-black hover:text-white transition-colors">
                      <MessageCircle size={20} strokeWidth={1} />
                    </a>
                  )}
                  <button onClick={() => { setSelectedServiceId(detailsModalService.id); setDate(""); setTime(""); setDetailsModalService(null); }} 
                    className="flex-1 bg-black text-white px-8 py-5 font-serif uppercase tracking-widest text-sm hover:bg-white hover:text-black border border-black transition-all duration-500">
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
