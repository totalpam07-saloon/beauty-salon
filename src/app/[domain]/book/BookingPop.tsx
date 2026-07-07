import { ArrowRight, CheckCircle2, ChevronDown, MessageCircle, User, Upload, X } from "lucide-react";
import { WeekCalendar } from "@/components/week-calendar";
import Link from "next/link";
import Image from "next/image";
import { Service, SalonSettings, Appointment, Staff } from "@/store/salon";
import { useBookingFlow } from "./useBookingFlow";
export function BookingPop({
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

  const inputClass = "w-full bg-white border-4 border-black rounded-xl p-4 outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

  // Navigation from TemplatePop
  const renderNav = () => null;

  if (!services || services.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans text-black">
        {renderNav()}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 mt-20 animate-in fade-in duration-700">
          <div className="w-24 h-24 bg-[#FFE5E5] border-4 border-black rounded-full flex items-center justify-center mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-4xl">✂️</span>
          </div>
          <h2 className="text-3xl font-black uppercase mb-4">Aucun Service</h2>
          <p className="font-bold max-w-md mb-8 text-black/70">
            Ce salon n'a pas encore ajouté de services à réserver. Veuillez repasser plus tard !
          </p>
          <Link href="/" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl border-4 border-black font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
            Retour à l'accueil
          </Link>
        </div>
        
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans text-black">
        {renderNav()}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 mt-20 animate-in fade-in duration-700">
          <div className="w-32 h-32 bg-[#E5FBE5] border-4 border-black rounded-full flex items-center justify-center mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CheckCircle2 className="w-16 h-16 text-black" strokeWidth={3} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase mb-6">{t("book.successTitle")}</h1>
          <p className="text-lg md:text-xl font-bold max-w-lg mb-10 text-black/70">
            {t("book.successDesc")}
          </p>
          <Link href="/" className="bg-primary text-primary-foreground px-10 py-5 rounded-full border-4 border-black font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
            {t("book.returnHome")}
          </Link>
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans text-black selection:bg-primary selection:text-white">
      {renderNav()}
      
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-32">
        <h1 className="text-4xl md:text-5xl font-black mb-12 text-center uppercase inline-block bg-[#FFE5E5] border-4 border-black px-8 py-4 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1 mx-auto">{t("book.title")}</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-16 relative px-4 max-w-md mx-auto">
          <div className="absolute top-1/2 left-4 right-4 h-2 bg-black -z-10 -translate-y-1/2 rounded-full"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-12 h-12 flex items-center justify-center font-black text-xl border-4 border-black rounded-full transition-all duration-300 ${step >= i ? "bg-primary text-primary-foreground scale-125 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-white text-black/50"}`}>
              {i}
            </div>
          ))}
        </div>

        <div className="bg-white border-4 border-black rounded-[2rem] p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <h2 className="text-3xl font-black uppercase bg-black text-white inline-block px-4 py-2 -ml-2 -rotate-1">{t("book.step1")}</h2>

              {/* Service selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#FFE5E5] border-4 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <label className="block text-sm font-black uppercase text-black">Service Sélectionné</label>
                  {!isChangingService && (
                    <button onClick={() => setIsChangingService(true)} className="text-sm font-black uppercase bg-white border-2 border-black px-3 py-1 rounded-full hover:bg-black hover:text-white transition-colors">
                      Changer
                    </button>
                  )}
                </div>
                
                {isChangingService ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[400px] overflow-y-auto p-2 no-scrollbar">
                    {services.map((s) => (
                      <div key={s.id} role="button" tabIndex={0} onClick={() => { setSelectedServiceId(s.id); setDate(""); setTime(""); setIsChangingService(false); }}
                        className={`flex flex-col text-left overflow-hidden border-4 rounded-2xl transition-all cursor-pointer ${selectedServiceId === s.id ? "border-black bg-[#FFE5E5] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1" : "border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"}`}>
                        {s.imageUrl && (
                          <div className="w-full h-32 bg-[#F0F0F0] border-b-4 border-black relative">
                            <Image src={s.imageUrl} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" alt={s.name} />
                            {selectedServiceId === s.id && (
                              <div className="absolute top-2 right-2 bg-primary text-black border-2 border-black rounded-full p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <CheckCircle2 size={16} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        )}
                        <div className="p-4 flex-1 flex flex-col justify-between w-full">
                          <div className="space-y-2 mb-4">
                            <p className="font-black text-xl uppercase leading-tight">{s.name}</p>
                            <p className="text-sm font-bold bg-white border-2 border-black px-2 py-1 rounded-lg inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{s.duration}</p>
                          </div>
                          <div className="flex justify-between items-end mt-auto">
                            <p className="font-black text-2xl">${s.priceUSD} <span className="text-xs text-black/60 font-bold block">{s.priceHTG.toLocaleString()} HTG</span></p>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setDetailsModalService(s); }} className="text-xs font-black uppercase bg-black text-white px-3 py-1.5 rounded-lg hover:bg-primary hover:text-black transition-colors border-2 border-black">
                              + Infos
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  selectedService && (
                    <div className="flex flex-col sm:flex-row text-left overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                      {selectedService.imageUrl && (
                        <div className="w-full sm:w-48 h-40 sm:h-auto bg-[#F0F0F0] border-r-4 border-black relative shrink-0">
                          <Image src={selectedService.imageUrl} fill sizes="(max-width: 640px) 100vw, 192px" className="object-cover" alt={selectedService.name} />
                          <div className="absolute top-2 left-2 bg-primary text-black border-4 border-black rounded-full p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <CheckCircle2 size={16} strokeWidth={3} />
                          </div>
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col justify-between w-full">
                        <div className="space-y-1">
                          <p className="font-black text-2xl uppercase leading-tight">{selectedService.name}</p>
                          <p className="text-sm font-black uppercase text-primary border-2 border-black bg-white px-2 py-0.5 rounded-full inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{selectedService.category}</p>
                        </div>
                        <div className="flex justify-between items-end mt-6">
                          <p className="font-black text-3xl">${selectedService.priceUSD} <span className="text-sm text-black/60 font-bold block">{selectedService.priceHTG.toLocaleString()} HTG</span></p>
                          <p className="text-sm font-black bg-[#FFE5E5] border-2 border-black px-3 py-1.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3">{selectedService.duration}</p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Staff Selector */}
              {staffList.length > 0 && (
                <div className="space-y-4">
                  <label className="block text-xl font-black uppercase ml-1"><span className="bg-primary text-black px-2 py-0.5 mr-2 border-2 border-black rounded-lg">{t("book.staffLabel")}</span></label>
                  <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar px-1">
                    <div role="button" tabIndex={0} onClick={() => { setSelectedStaffId("any"); setDate(""); setTime(""); }}
                      className={`flex-shrink-0 w-28 h-28 flex flex-col items-center justify-center rounded-[2rem] border-4 transition-all cursor-pointer ${selectedStaffId === "any" ? "border-black bg-primary text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1" : "border-black hover:border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"}`}>
                      <User className="w-8 h-8 mb-2" strokeWidth={3} />
                      <span className="font-black text-sm uppercase text-center leading-tight">{t("book.anyStaff")}</span>
                    </div>
                    {staffList.map(staff => (
                      <div key={staff.id} role="button" tabIndex={0} onClick={() => { setSelectedStaffId(staff.id); setDate(""); setTime(""); }}
                        className={`flex-shrink-0 w-28 h-28 flex flex-col items-center justify-center rounded-[2rem] border-4 transition-all cursor-pointer relative overflow-hidden ${selectedStaffId === staff.id ? "border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1" : "border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"}`}>
                        {staff.imageUrl ? (
                          <>
                            <Image src={staff.imageUrl} fill sizes="112px" className="object-cover" alt={staff.name} />
                            <div className="absolute inset-0 bg-black/30" />
                            <span className="font-black text-sm text-white z-10 drop-shadow-md text-center px-1 uppercase">{staff.name}</span>
                            {selectedStaffId === staff.id && (
                              <div className="absolute top-2 right-2 bg-primary border-2 border-black text-black rounded-full p-0.5 z-10">
                                <CheckCircle2 size={12} strokeWidth={4} />
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <User className="w-8 h-8 mb-2" strokeWidth={3} />
                            <span className="font-black text-sm uppercase text-center leading-tight px-1">{staff.name}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Week Calendar */}
              <div className="space-y-4">
                <label className="block text-xl font-black uppercase ml-1"><span className="bg-[#E5FBE5] text-black px-2 py-0.5 mr-2 border-2 border-black rounded-lg">{t("book.selectDate")}</span></label>
                {selectedService && (
                  <div className="border-4 border-black rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
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

              <button disabled={!date || !time} onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-3 bg-primary text-black border-4 border-black p-5 rounded-full font-black uppercase text-xl disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {t("book.next")} <ArrowRight size={24} strokeWidth={3} />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-black uppercase bg-black text-white inline-block px-4 py-2 -ml-2 rotate-1">{t("book.step2")}</h2>
              <div className="space-y-6">
                <input placeholder={t("book.name")} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                <div className="flex gap-4">
                  <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-white border-4 border-black rounded-xl p-4 outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[120px]">
                    <option value="+509">🇭🇹 +509</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+33">🇫🇷 +33</option>
                  </select>
                  <input placeholder={t("book.phone")} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`flex-1 ${inputClass}`} />
                </div>
                <input placeholder={t("book.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </div>
              <div className="flex gap-6 pt-4">
                <button onClick={() => setStep(1)} className="flex-1 p-5 rounded-full border-4 border-black font-black uppercase hover:bg-gray-100 transition-colors bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">{t("book.back")}</button>
                <button disabled={!name || (!phone && !email)} onClick={() => setStep(3)}
                  className="flex-[2] bg-primary text-black border-4 border-black p-5 rounded-full font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  {t("book.next")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && selectedService && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-black uppercase bg-black text-white inline-block px-4 py-2 -ml-2 -rotate-1">{t("book.step3")}</h2>

              {/* Payment Method Selector */}
              <div className="space-y-4">
                <label className="block text-xl font-black uppercase ml-1"><span className="bg-[#FFE5E5] text-black px-2 py-0.5 mr-2 border-2 border-black rounded-lg">{t("book.methodLabel")}</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {availableMethods.map((m) => (
                    <button key={m.key} onClick={() => setPaymentMethod(m.key)}
                      className={`p-4 rounded-xl border-4 transition-all flex flex-col items-center justify-center gap-1 min-h-[90px] ${paymentMethod === m.key ? "bg-black border-black text-white shadow-[6px_6px_0px_0px_rgba(255,138,91,1)] -translate-y-1" : "bg-white border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black"}`}>
                      <span className="font-black uppercase">{m.label}</span>
                      <span className={`text-xs font-bold ${paymentMethod === m.key ? "text-primary" : "text-black/50"}`}>{m.currency}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Deposit Info */}
              {selectedMethodInfo && (
                <div className="bg-[#E5FBE5] border-4 border-black rounded-[2rem] p-6 md:p-8 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-center pb-4 border-b-4 border-black">
                    <span className="text-black font-black uppercase">{t("book.totalPrice")}</span>
                    <span className="text-2xl font-black text-black">
                      {payCurrency === "HTG" ? `${fullPrice.toLocaleString()} HTG` : `$${fullPrice}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-black font-black uppercase flex flex-col sm:flex-row sm:items-center gap-2">
                      {t("book.minDeposit")}
                      {selectedService.depositType === "percentage" && (
                        <span className="text-xs bg-white text-black border-2 border-black px-2 py-0.5 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{selectedService.depositPercentage}%</span>
                      )}
                    </span>
                    <span className="text-3xl font-black text-primary drop-shadow-[2px_2px_0_#000]">
                      {payCurrency === "HTG" ? `${minDeposit.toLocaleString()} HTG` : `$${minDeposit}`}
                    </span>
                  </div>

                  <p className="text-sm text-black font-bold bg-white border-2 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
                    {t("book.payInfo")}
                  </p>

                  {/* Payment destination */}
                  <div className="bg-white p-5 rounded-xl border-4 border-black font-black text-base text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-1">
                    {selectedMethodInfo.label}: <span className="text-primary underline decoration-4 underline-offset-2">{selectedMethodInfo.info}</span>
                  </div>

                  {/* Amount field */}
                  <div className="space-y-2 pt-4">
                    <label className="block text-sm font-black uppercase text-black">{t("book.amountSent")} ({payCurrency})</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={`Min. ${minDeposit.toLocaleString()}`}
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        className="w-full bg-white border-4 border-black rounded-xl p-4 pr-20 outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-xl text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-black/40">{payCurrency}</span>
                    </div>
                  </div>

                  {/* Screenshot Upload */}
                  <div className="pt-2">
                    <label className="relative flex flex-col items-center justify-center w-full min-h-[160px] py-8 border-4 border-dashed border-black rounded-2xl cursor-pointer hover:bg-white transition-colors bg-white/50 overflow-hidden group">
                      {filePreview ? (
                        <>
                          <Image src={filePreview} alt="Preview" fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover opacity-60" />
                          <div className="z-10 flex flex-col items-center justify-center bg-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center rotate-2 group-hover:scale-105 transition-transform">
                            <CheckCircle2 className="text-primary w-10 h-10 mb-1 mx-auto" strokeWidth={3} />
                            <span className="font-black text-xs text-black max-w-[180px] truncate">{fileName}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-primary border-4 border-black rounded-full flex items-center justify-center mb-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1 transition-transform">
                            <Upload className="text-black w-8 h-8" strokeWidth={3} />
                          </div>
                          <span className="font-black text-sm text-black text-center px-4 uppercase">{fileName ? fileName : t("book.upload")}</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-6 pt-4">
                <button onClick={() => setStep(2)} className="flex-1 p-5 rounded-full border-4 border-black font-black uppercase hover:bg-gray-100 transition-colors bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">{t("book.back")}</button>
                <button
                  disabled={!fileName || !amountPaid || isSubmitting}
                  onClick={handleSubmit}
                  className="flex-[2] flex items-center justify-center gap-3 bg-black text-white p-5 rounded-full font-black uppercase hover:bg-gray-900 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><CheckCircle2 size={24} strokeWidth={3} /> {t("book.confirm")}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {detailsModalService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] border-4 border-black max-w-xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
            <button onClick={() => setDetailsModalService(null)} className="absolute top-4 right-4 bg-white border-4 border-black text-black rounded-full p-2 hover:bg-primary transition-colors z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <X size={24} strokeWidth={3} />
            </button>
            {detailsModalService.imageUrl && (
              <div className="relative w-full h-64 bg-[#F0F0F0] border-b-4 border-black">
                <Image src={detailsModalService.imageUrl} alt={detailsModalService.name} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
              </div>
            )}
            <div className="p-8 md:p-10 space-y-6">
              <div>
                <h3 className="text-4xl font-black text-black leading-tight mb-4 uppercase">{detailsModalService.name}</h3>
                {detailsModalService.category && (
                  <span className="inline-block text-xs font-black uppercase bg-[#FFE5E5] border-2 border-black text-black px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2">{detailsModalService.category}</span>
                )}
              </div>
              
              {detailsModalService.description ? (
                <div className="text-black font-bold leading-relaxed whitespace-pre-wrap bg-gray-50 border-4 border-black p-4 rounded-xl">
                  {detailsModalService.description}
                </div>
              ) : (
                <p className="text-black/50 italic font-bold">Aucune description disponible.</p>
              )}

              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="w-full sm:w-auto text-center sm:text-left bg-[#E5FBE5] border-4 border-black px-6 py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-1">
                  <p className="text-xs uppercase font-black text-black mb-1">Durée & Prix</p>
                  <p className="font-black text-black text-xl">{detailsModalService.duration} <span className="mx-2 text-black">|</span> <span className="text-3xl text-primary drop-shadow-[2px_2px_0_#000]">${detailsModalService.priceUSD} <span className="text-sm opacity-70 ml-2 font-bold whitespace-nowrap">/ {detailsModalService.priceHTG.toLocaleString()} HTG</span></span></p>
                </div>
                <div className="flex w-full sm:w-auto gap-4">
                  {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center bg-[#25D366] border-4 border-black text-black px-5 rounded-xl hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform">
                      <MessageCircle size={24} strokeWidth={3} />
                    </a>
                  )}
                  <button onClick={() => { setSelectedServiceId(detailsModalService.id); setDate(""); setTime(""); setDetailsModalService(null); }} 
                    className="flex-1 sm:flex-none bg-black text-white px-8 py-4 rounded-xl border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all text-lg">
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
