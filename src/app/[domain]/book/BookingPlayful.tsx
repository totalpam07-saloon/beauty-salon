import { ArrowRight, CheckCircle2, ChevronDown, MessageCircle, User, Upload, X } from "lucide-react";
import { WeekCalendar } from "@/components/week-calendar";
import Link from "next/link";
import Image from "next/image";
import { Service, SalonSettings, Appointment, Staff } from "@/store/salon";
import { useBookingFlow } from "./useBookingFlow";
export function BookingPlayful({
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

  const inputClass = "w-full bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-2xl p-4 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all font-medium text-slate-800 shadow-sm";

  const renderNav = () => null;

  if (!services || services.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F0F5FF] font-sans">
        {renderNav()}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 mt-20 relative z-10 animate-in fade-in duration-700">
          <div className="w-24 h-24 bg-white/80 backdrop-blur-sm rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-primary/10 rotate-12">
            <span className="text-4xl">✂️</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Aucun Service</h2>
          <p className="font-medium text-slate-600 max-w-md mb-8">
            Ce salon n'a pas encore ajouté de services à réserver. Veuillez repasser plus tard !
          </p>
          <Link href="/" className="bg-gradient-to-r from-primary to-purple-500 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            Retour à l'accueil
          </Link>
        </div>
        
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F0F5FF] font-sans">
        {renderNav()}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 mt-20 relative z-10 animate-in fade-in duration-700">
          <div className="w-32 h-32 bg-white/80 backdrop-blur-sm rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-green-500/20 rotate-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-green-400/20 animate-pulse"></div>
            <CheckCircle2 className="w-16 h-16 text-green-500 relative z-10" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">{t("book.successTitle")}</h1>
          <p className="text-lg font-medium text-slate-600 max-w-lg mb-10 leading-relaxed">
            {t("book.successDesc")}
          </p>
          <Link href="/" className="bg-gradient-to-r from-primary to-purple-500 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all">
            {t("book.returnHome")}
          </Link>
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F5FF] font-sans relative selection:bg-purple-300 selection:text-slate-900">
      {/* Background Animated Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-300/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-[blob_7s_infinite]"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-purple-300/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-[blob_7s_infinite_2s]"></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-cyan-300/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-[blob_7s_infinite_4s]"></div>
      </div>

      {renderNav()}
      
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-32 relative z-10">
        <div className="text-center mb-12">
          <span className="bg-white/60 backdrop-blur-md text-primary font-bold px-4 py-1.5 rounded-full text-sm shadow-sm mb-4 inline-block">
            RÉSERVATION
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">{t("book.title")}</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12 relative px-4 max-w-md mx-auto">
          <div className="absolute top-1/2 left-4 right-4 h-2 bg-white/50 backdrop-blur-sm -z-10 -translate-y-1/2 rounded-full"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-12 h-12 flex items-center justify-center font-extrabold text-lg rounded-full transition-all duration-300 shadow-sm ${step >= i ? "bg-gradient-to-tr from-primary to-purple-500 text-white scale-110 shadow-primary/30" : "bg-white/80 text-slate-400"}`}>
              {i}
            </div>
          ))}
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[3rem] p-6 md:p-10 shadow-[0_8px_32px_rgba(31,38,135,0.07)]">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h2 className="text-2xl font-extrabold text-slate-800 text-center">{t("book.step1")}</h2>

              {/* Service selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/50 p-3 rounded-2xl shadow-sm border border-white/50">
                  <label className="block text-sm font-bold text-slate-700 ml-2">Service</label>
                  {!isChangingService && (
                    <button onClick={() => setIsChangingService(true)} className="text-sm font-bold text-primary bg-white px-4 py-1.5 rounded-full shadow-sm hover:shadow transition-shadow">
                      Changer
                    </button>
                  )}
                </div>
                
                {isChangingService ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2 no-scrollbar">
                    {services.map((s) => (
                      <div key={s.id} role="button" tabIndex={0} onClick={() => { setSelectedServiceId(s.id); setDate(""); setTime(""); setIsChangingService(false); }}
                        className={`flex flex-col text-left overflow-hidden rounded-[2rem] transition-all cursor-pointer border-2 ${selectedServiceId === s.id ? "border-purple-400 bg-white/80 shadow-md shadow-purple-400/20 -translate-y-1" : "border-white/50 bg-white/40 hover:bg-white/60 shadow-sm hover:shadow-md hover:-translate-y-1"}`}>
                        {s.imageUrl && (
                          <div className="w-full h-32 bg-slate-100 relative">
                            <Image src={s.imageUrl} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" alt={s.name} />
                            {selectedServiceId === s.id && (
                              <div className="absolute top-3 right-3 bg-white text-purple-500 rounded-full p-1 shadow-md">
                                <CheckCircle2 size={16} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col justify-between w-full">
                          <div className="space-y-1 mb-4">
                            <p className="font-extrabold text-slate-800 leading-tight">{s.name}</p>
                            <p className="text-xs font-bold text-slate-500 bg-white/80 px-2 py-1 rounded-lg inline-block shadow-sm">{s.duration}</p>
                          </div>
                          <div className="flex justify-between items-end mt-auto">
                            <p className="font-black text-xl text-primary">${s.priceUSD}</p>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setDetailsModalService(s); }} className="text-xs font-bold text-slate-500 bg-white shadow-sm px-3 py-1.5 rounded-xl hover:text-primary transition-colors">
                              + Infos
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  selectedService && (
                    <div className="flex flex-col sm:flex-row text-left overflow-hidden rounded-[2.5rem] border-2 border-white/50 bg-white/60 shadow-lg shadow-primary/5">
                      {selectedService.imageUrl && (
                        <div className="w-full sm:w-48 h-40 sm:h-auto bg-slate-100 relative shrink-0">
                          <Image src={selectedService.imageUrl} fill sizes="(max-width: 640px) 100vw, 192px" className="object-cover" alt={selectedService.name} />
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary rounded-full p-1.5 shadow-md">
                            <CheckCircle2 size={18} strokeWidth={3} />
                          </div>
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col justify-between w-full">
                        <div className="space-y-2">
                          <p className="text-xs font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">{selectedService.category}</p>
                          <p className="font-extrabold text-2xl text-slate-800 leading-tight">{selectedService.name}</p>
                        </div>
                        <div className="flex justify-between items-end mt-6">
                          <p className="font-black text-3xl text-slate-800">${selectedService.priceUSD}</p>
                          <p className="text-sm font-bold bg-white/80 px-4 py-2 rounded-2xl shadow-sm text-slate-600">{selectedService.duration}</p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Staff Selector */}
              {staffList.length > 0 && (
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700 ml-2">{t("book.staffLabel")}</label>
                  <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar px-1">
                    <div role="button" tabIndex={0} onClick={() => { setSelectedStaffId("any"); setDate(""); setTime(""); }}
                      className={`flex-shrink-0 w-24 h-24 flex flex-col items-center justify-center rounded-[2rem] border-2 transition-all cursor-pointer ${selectedStaffId === "any" ? "border-purple-400 bg-white shadow-md shadow-purple-400/20 scale-105" : "border-white/50 bg-white/40 hover:bg-white/60 shadow-sm hover:scale-105"}`}>
                      <User className={`w-8 h-8 mb-1 ${selectedStaffId === "any" ? "text-purple-500" : "text-slate-400"}`} strokeWidth={2.5} />
                      <span className="font-bold text-xs text-center text-slate-600 leading-tight">{t("book.anyStaff")}</span>
                    </div>
                    {staffList.map(staff => (
                      <div key={staff.id} role="button" tabIndex={0} onClick={() => { setSelectedStaffId(staff.id); setDate(""); setTime(""); }}
                        className={`flex-shrink-0 w-24 h-24 flex flex-col items-center justify-center rounded-[2rem] border-2 transition-all cursor-pointer relative overflow-hidden ${selectedStaffId === staff.id ? "border-purple-400 shadow-md shadow-purple-400/20 scale-105" : "border-white/50 bg-white/40 hover:bg-white/60 shadow-sm hover:scale-105"}`}>
                        {staff.imageUrl ? (
                          <>
                            <Image src={staff.imageUrl} fill sizes="96px" className="object-cover" alt={staff.name} />
                            <div className="absolute inset-0 bg-slate-900/20" />
                            <span className="font-bold text-xs text-white z-10 drop-shadow-md text-center px-1 leading-tight">{staff.name}</span>
                            {selectedStaffId === staff.id && (
                              <div className="absolute top-2 right-2 bg-white text-purple-500 rounded-full p-0.5 z-10 shadow-sm">
                                <CheckCircle2 size={12} strokeWidth={3} />
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <User className={`w-8 h-8 mb-1 ${selectedStaffId === staff.id ? "text-purple-500" : "text-slate-400"}`} strokeWidth={2.5} />
                            <span className="font-bold text-xs text-center text-slate-600 leading-tight px-1">{staff.name}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Week Calendar */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 ml-2">{t("book.selectDate")}</label>
                {selectedService && (
                  <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-[2.5rem] p-4 shadow-sm">
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
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-purple-500 text-white p-5 rounded-full font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 transition-all shadow-md">
                {t("book.next")} <ArrowRight size={22} strokeWidth={2.5} />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-extrabold text-slate-800 text-center">{t("book.step2")}</h2>
              <div className="space-y-6 bg-white/40 p-6 rounded-[2.5rem] border border-white/50 shadow-inner">
                <input placeholder={t("book.name")} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                <div className="flex gap-4">
                  <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-2xl p-4 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all font-bold text-slate-700 shadow-sm min-w-[110px]">
                    <option value="+509">🇭🇹 +509</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+33">🇫🇷 +33</option>
                  </select>
                  <input placeholder={t("book.phone")} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`flex-1 ${inputClass}`} />
                </div>
                <input placeholder={t("book.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(1)} className="flex-1 p-5 rounded-full border-2 border-white/50 bg-white/60 font-bold text-slate-600 hover:bg-white hover:shadow-sm transition-all">{t("book.back")}</button>
                <button disabled={!name || (!phone && !email)} onClick={() => setStep(3)}
                  className="flex-[2] bg-gradient-to-r from-primary to-purple-500 text-white p-5 rounded-full font-bold text-lg shadow-md hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  {t("book.next")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && selectedService && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-extrabold text-slate-800 text-center">{t("book.step3")}</h2>

              {/* Payment Method Selector */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 ml-2">{t("book.methodLabel")}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {availableMethods.map((m) => (
                    <button key={m.key} onClick={() => setPaymentMethod(m.key)}
                      className={`p-4 rounded-[1.5rem] border-2 transition-all flex flex-col items-center justify-center gap-1 min-h-[90px] shadow-sm ${paymentMethod === m.key ? "border-purple-400 bg-white shadow-md shadow-purple-400/20 scale-105" : "border-white/50 bg-white/40 hover:bg-white/60 hover:scale-105"}`}>
                      <span className="font-extrabold text-slate-800">{m.label}</span>
                      <span className={`text-xs font-bold ${paymentMethod === m.key ? "text-purple-500" : "text-slate-500"}`}>{m.currency}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Deposit Info */}
              {selectedMethodInfo && (
                <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-lg shadow-primary/5">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200/50">
                    <span className="text-slate-600 font-bold">{t("book.totalPrice")}</span>
                    <span className="text-xl font-black text-slate-800">
                      {payCurrency === "HTG" ? `${fullPrice.toLocaleString()} HTG` : `$${fullPrice}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-bold flex items-center gap-2">
                      {t("book.minDeposit")}
                      {selectedService.depositType === "percentage" && (
                        <span className="text-xs bg-gradient-to-r from-primary to-purple-500 text-white px-2 py-0.5 rounded-lg shadow-sm">{selectedService.depositPercentage}%</span>
                      )}
                    </span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                      {payCurrency === "HTG" ? `${minDeposit.toLocaleString()} HTG` : `$${minDeposit}`}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 font-medium bg-white/80 p-4 rounded-2xl shadow-sm border border-white/50">
                    {t("book.payInfo")}
                  </p>

                  {/* Payment destination */}
                  <div className="bg-white p-5 rounded-2xl border border-white font-extrabold text-base text-center shadow-md">
                    <span className="text-slate-500 mr-2">{selectedMethodInfo.label}:</span>
                    <span className="text-purple-600">{selectedMethodInfo.info}</span>
                  </div>

                  {/* Amount field */}
                  <div className="space-y-2 pt-4">
                    <label className="block text-sm font-bold text-slate-700 ml-2">{t("book.amountSent")} ({payCurrency})</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={`Min. ${minDeposit.toLocaleString()}`}
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        className="w-full bg-white border-2 border-white/50 rounded-2xl p-4 pr-20 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all font-black text-xl text-slate-800 shadow-sm"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 font-extrabold text-slate-400">{payCurrency}</span>
                    </div>
                  </div>

                  {/* Screenshot Upload */}
                  <div className="pt-2">
                    <label className="relative flex flex-col items-center justify-center w-full min-h-[160px] py-8 border-2 border-dashed border-purple-300 rounded-[2rem] cursor-pointer hover:bg-white/50 transition-colors bg-white/30 overflow-hidden group">
                      {filePreview ? (
                        <>
                          <Image src={filePreview} alt="Preview" fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover opacity-60" />
                          <div className="z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg text-center group-hover:scale-105 transition-transform">
                            <CheckCircle2 className="text-green-500 w-10 h-10 mb-2 mx-auto" strokeWidth={2.5} />
                            <span className="font-bold text-xs text-slate-700 max-w-[180px] truncate">{fileName}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                            <Upload className="text-purple-400 w-8 h-8" strokeWidth={2.5} />
                          </div>
                          <span className="font-bold text-sm text-slate-600 text-center px-4">{fileName ? fileName : t("book.upload")}</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(2)} className="flex-1 p-5 rounded-full border-2 border-white/50 bg-white/60 font-bold text-slate-600 hover:bg-white hover:shadow-sm transition-all">{t("book.back")}</button>
                <button
                  disabled={!fileName || !amountPaid || isSubmitting}
                  onClick={handleSubmit}
                  className="flex-[2] flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-purple-500 text-white p-5 rounded-full font-bold text-lg hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><CheckCircle2 size={22} strokeWidth={2.5} /> {t("book.confirm")}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {detailsModalService && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[3rem] max-w-xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl relative">
            <button onClick={() => setDetailsModalService(null)} className="absolute top-4 right-4 bg-white text-slate-600 rounded-full p-2.5 hover:text-primary transition-colors z-10 shadow-md">
              <X size={20} strokeWidth={2.5} />
            </button>
            {detailsModalService.imageUrl && (
              <div className="relative w-full h-64 bg-slate-100">
                <Image src={detailsModalService.imageUrl} alt={detailsModalService.name} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
              </div>
            )}
            <div className={`p-8 md:p-10 space-y-6 ${!detailsModalService.imageUrl ? 'pt-16' : '-mt-12 relative z-10'}`}>
              <div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight mb-3">{detailsModalService.name}</h3>
                {detailsModalService.category && (
                  <span className="inline-block text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 uppercase tracking-wider">{detailsModalService.category}</span>
                )}
              </div>
              
              {detailsModalService.description ? (
                <div className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap bg-slate-50 p-5 rounded-2xl">
                  {detailsModalService.description}
                </div>
              ) : (
                <p className="text-slate-400 italic font-medium">Aucune description disponible.</p>
              )}

              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="w-full sm:w-auto text-center sm:text-left bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Durée & Prix</p>
                  <p className="font-extrabold text-slate-800 text-lg">{detailsModalService.duration} <span className="mx-2 text-slate-300">|</span> <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">${detailsModalService.priceUSD} <span className="text-sm opacity-70 ml-2 font-bold whitespace-nowrap">/ {detailsModalService.priceHTG.toLocaleString()} HTG</span></span></p>
                </div>
                <div className="flex w-full sm:w-auto gap-3">
                  {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center bg-[#25D366]/10 text-[#25D366] px-5 rounded-2xl hover:bg-[#25D366]/20 transition-colors">
                      <MessageCircle size={24} strokeWidth={2.5} />
                    </a>
                  )}
                  <button onClick={() => { setSelectedServiceId(detailsModalService.id); setDate(""); setTime(""); setDetailsModalService(null); }} 
                    className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-purple-500 text-white px-8 py-4 rounded-2xl font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all text-lg">
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
