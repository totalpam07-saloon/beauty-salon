import { ArrowRight, CheckCircle2, ChevronDown, MessageCircle, User, Upload, X } from "lucide-react";
import { WeekCalendar } from "@/components/week-calendar";
import Link from "next/link";
import Image from "next/image";
import { Service, SalonSettings, Appointment, Staff } from "@/store/salon";
import { useBookingFlow } from "./useBookingFlow";
export function BookingClassic({
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

  const inputClass = "w-full bg-background border-2 border-border rounded-2xl p-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground";

  // Navigation from TemplateClassic
  const renderNav = () => null;

  if (!services || services.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        {renderNav()}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-700">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">✂️</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Aucun Service</h2>
          <p className="text-gray-500 font-medium max-w-md mb-8">
            Ce salon n'a pas encore ajouté de services à réserver. Veuillez repasser plus tard !
          </p>
          <Link href="/" className="bg-black text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity">
            Retour à l'accueil
          </Link>
        </div>
        
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        {renderNav()}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-700">
          <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-50"></div>
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-gray-900">{t("book.successTitle")}</h1>
          <p className="text-lg md:text-xl font-medium text-gray-500 max-w-lg mb-10 leading-relaxed">
            {t("book.successDesc")}
          </p>
          <Link href="/" className="bg-black text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:-translate-y-1 transition-all duration-300">
            {t("book.returnHome")}
          </Link>
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {renderNav()}
      
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-black mb-10 text-center text-gray-900 tracking-tight">{t("book.title")}</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12 relative px-4 max-w-md mx-auto">
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step >= i ? "bg-black text-white scale-110 shadow-lg" : "bg-white border-4 border-gray-50 text-gray-400"}`}>
              {i}
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-xl shadow-gray-200/50">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h2 className="text-2xl font-black text-gray-900">{t("book.step1")}</h2>

              {/* Service selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center ml-2 pr-2">
                  <label className="block text-sm font-bold text-gray-700">Service</label>
                  {!isChangingService && (
                    <button onClick={() => setIsChangingService(true)} className="text-sm font-bold text-blue-600 hover:underline">
                      Changer de Service
                    </button>
                  )}
                </div>
                
                {isChangingService ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    {services.map((s) => (
                      <div key={s.id} role="button" tabIndex={0} onClick={() => { setSelectedServiceId(s.id); setDate(""); setTime(""); setIsChangingService(false); }}
                        className={`flex flex-col text-left overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${selectedServiceId === s.id ? "border-black ring-4 ring-black/5 shadow-md" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                        {s.imageUrl && (
                          <div className="w-full h-32 bg-gray-100 relative">
                            <Image src={s.imageUrl} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" alt={s.name} />
                            {selectedServiceId === s.id && (
                              <div className="absolute top-2 right-2 bg-black text-white rounded-full p-1 shadow-sm">
                                <CheckCircle2 size={16} />
                              </div>
                            )}
                          </div>
                        )}
                        <div className="p-4 flex-1 flex flex-col justify-between w-full">
                          <div className="space-y-1 mb-4">
                            <div className="flex justify-between items-start gap-2">
                              <p className="font-bold text-gray-900 leading-tight">{s.name}</p>
                              <p className="text-xs font-medium text-gray-500 whitespace-nowrap bg-gray-100 px-2 py-1 rounded-md">{s.duration}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-end mt-auto">
                            <p className="font-black text-lg text-gray-900">${s.priceUSD} <span className="text-xs text-gray-400 font-bold ml-1">/ {s.priceHTG.toLocaleString()} HTG</span></p>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setDetailsModalService(s); }} className="text-xs font-bold text-gray-500 hover:text-black transition-colors underline">
                              Détails
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  selectedService && (
                    <div className="flex flex-col sm:flex-row text-left overflow-hidden rounded-2xl border-2 border-black bg-gray-50 shadow-sm">
                      {selectedService.imageUrl && (
                        <div className="w-full sm:w-48 h-40 sm:h-auto bg-gray-200 relative shrink-0">
                          <Image src={selectedService.imageUrl} fill sizes="(max-width: 640px) 100vw, 192px" className="object-cover" alt={selectedService.name} />
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col justify-between w-full">
                        <div className="space-y-1">
                          <p className="font-black text-xl text-gray-900 leading-tight">{selectedService.name}</p>
                          <p className="text-sm font-bold text-gray-500">{selectedService.category}</p>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                          <p className="font-black text-xl text-gray-900">${selectedService.priceUSD} <span className="text-sm text-gray-500 font-bold ml-1">/ {selectedService.priceHTG.toLocaleString()} HTG</span></p>
                          <p className="text-sm font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">{selectedService.duration}</p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Staff Selector */}
              {staffList.length > 0 && (
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 ml-2">{t("book.staffLabel")}</label>
                  <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar px-1">
                    <div role="button" tabIndex={0} onClick={() => { setSelectedStaffId("any"); setDate(""); setTime(""); }}
                      className={`flex-shrink-0 w-28 h-28 flex flex-col items-center justify-center rounded-2xl border-2 transition-all cursor-pointer ${selectedStaffId === "any" ? "border-black bg-gray-50 ring-4 ring-black/5" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                      <User className={`w-8 h-8 mb-2 ${selectedStaffId === "any" ? "text-black" : "text-gray-400"}`} />
                      <span className="font-bold text-sm text-gray-900">{t("book.anyStaff")}</span>
                    </div>
                    {staffList.map(staff => (
                      <div key={staff.id} role="button" tabIndex={0} onClick={() => { setSelectedStaffId(staff.id); setDate(""); setTime(""); }}
                        className={`flex-shrink-0 w-28 h-28 flex flex-col items-center justify-center rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${selectedStaffId === staff.id ? "border-black ring-4 ring-black/5" : "border-gray-100 hover:border-gray-300 bg-white"}`}>
                        {staff.imageUrl ? (
                          <>
                            <Image src={staff.imageUrl} fill sizes="112px" className="object-cover opacity-80" alt={staff.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <span className="font-bold text-sm text-white z-10 mt-auto mb-2 text-center px-2">{staff.name}</span>
                            {selectedStaffId === staff.id && (
                              <div className="absolute top-2 right-2 bg-black text-white rounded-full p-0.5 z-10">
                                <CheckCircle2 size={12} />
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <User className={`w-8 h-8 mb-2 ${selectedStaffId === staff.id ? "text-black" : "text-gray-400"}`} />
                            <span className="font-bold text-sm text-gray-900 text-center px-2">{staff.name}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Week Calendar */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 ml-2">{t("book.selectDate")}</label>
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
                className="w-full flex items-center justify-center gap-3 bg-black text-white p-5 rounded-2xl font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors text-lg">
                {t("book.next")} <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-black text-gray-900">{t("book.step2")}</h2>
              <div className="space-y-5">
                <input placeholder={t("book.name")} value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium text-gray-900" />
                <div className="flex gap-3">
                  <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-bold min-w-[110px]">
                    <option value="+509">🇭🇹 +509</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+33">🇫🇷 +33</option>
                  </select>
                  <input placeholder={t("book.phone")} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium text-gray-900" />
                </div>
                <input placeholder={t("book.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium text-gray-900" />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(1)} className="flex-1 p-5 rounded-2xl border border-gray-200 font-bold hover:bg-gray-50 transition-colors text-gray-700">{t("book.back")}</button>
                <button disabled={!name || (!phone && !email)} onClick={() => setStep(3)}
                  className="flex-1 bg-black text-white p-5 rounded-2xl font-bold hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {t("book.next")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && selectedService && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-black text-gray-900">{t("book.step3")}</h2>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 ml-1">{t("book.methodLabel")}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableMethods.map((m) => (
                    <button key={m.key} onClick={() => setPaymentMethod(m.key)}
                      className={`p-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-1 ${paymentMethod === m.key ? "bg-black text-white border-black" : "bg-white border-gray-200 hover:border-gray-400 text-gray-700"}`}>
                      <span>{m.label}</span>
                      <span className={`text-xs ${paymentMethod === m.key ? "text-gray-300" : "text-gray-400"}`}>{m.currency}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Deposit Info */}
              {selectedMethodInfo && (
                <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">{t("book.totalPrice")}</span>
                    <span className="text-xl font-black text-gray-900">
                      {payCurrency === "HTG" ? `${fullPrice.toLocaleString()} HTG` : `$${fullPrice}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-bold">
                      {t("book.minDeposit")}{" "}
                      {selectedService.depositType === "percentage" && (
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-bold ml-1">{selectedService.depositPercentage}%</span>
                      )}
                    </span>
                    <span className="text-2xl font-black text-black">
                      {payCurrency === "HTG" ? `${minDeposit.toLocaleString()} HTG` : `$${minDeposit}`}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 font-medium">
                    {t("book.payInfo")}
                  </p>

                  {/* Payment destination */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 font-mono font-bold text-base shadow-sm text-center">
                    {selectedMethodInfo.label}: <span className="text-blue-600">{selectedMethodInfo.info}</span>
                  </div>

                  {/* Amount field */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-sm font-bold text-gray-700">{t("book.amountSent")} ({payCurrency})</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={`Min. ${minDeposit.toLocaleString()}`}
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-4 pr-20 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-bold text-lg text-gray-900"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-gray-400">{payCurrency}</span>
                    </div>
                  </div>

                  {/* Screenshot Upload */}
                  <div className="pt-2">
                    <label className="relative flex flex-col items-center justify-center w-full min-h-[160px] py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors bg-white overflow-hidden group">
                      {filePreview ? (
                        <>
                          <Image src={filePreview} alt="Preview" fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                          <div className="z-10 flex flex-col items-center justify-center bg-white/90 p-3 rounded-xl backdrop-blur-sm text-center shadow-sm">
                            <CheckCircle2 className="text-green-500 w-8 h-8 mb-1 mx-auto" />
                            <span className="font-bold text-xs text-gray-900 max-w-[180px] truncate">{fileName}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="text-gray-400 w-10 h-10 mb-3" />
                          <span className="font-bold text-sm text-gray-600 text-center px-4">{fileName ? fileName : t("book.upload")}</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(2)} className="flex-1 p-5 rounded-2xl border border-gray-200 font-bold hover:bg-gray-50 transition-colors text-gray-700">{t("book.back")}</button>
                <button
                  disabled={!fileName || !amountPaid || isSubmitting}
                  onClick={handleSubmit}
                  className="flex-[2] flex items-center justify-center gap-2 bg-black text-white p-5 rounded-2xl font-bold hover:bg-gray-900 transition-colors shadow-lg disabled:opacity-40 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><CheckCircle2 size={20} /> {t("book.confirm")}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {detailsModalService && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl relative">
            <button onClick={() => setDetailsModalService(null)} className="absolute top-4 right-4 bg-white/80 text-black rounded-full p-2 hover:bg-gray-100 transition-colors z-10 shadow-sm">
              <X size={20} />
            </button>
            {detailsModalService.imageUrl && (
              <div className="relative w-full h-64 bg-gray-100">
                <Image src={detailsModalService.imageUrl} alt={detailsModalService.name} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
              </div>
            )}
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-3xl font-black text-gray-900 leading-tight">{detailsModalService.name}</h3>
                {detailsModalService.category && (
                  <span className="inline-block mt-3 text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-md">{detailsModalService.category}</span>
                )}
              </div>
              
              {detailsModalService.description ? (
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
                  {detailsModalService.description}
                </div>
              ) : (
                <p className="text-gray-400 italic">Aucune description disponible.</p>
              )}

              <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Durée & Prix</p>
                  <p className="font-black text-gray-900">{detailsModalService.duration} • <span className="text-2xl">${detailsModalService.priceUSD} <span className="text-sm opacity-70 ml-2 font-bold whitespace-nowrap">/ {detailsModalService.priceHTG.toLocaleString()} HTG</span></span></p>
                </div>
                <div className="flex w-full sm:w-auto gap-3">
                  {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] px-4 py-3 rounded-xl font-bold hover:bg-[#25D366]/20 transition-all">
                      <MessageCircle size={18} />
                    </a>
                  )}
                  <button onClick={() => { setSelectedServiceId(detailsModalService.id); setDate(""); setTime(""); setDetailsModalService(null); }} 
                    className="flex-1 sm:flex-none bg-black text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-gray-900 transition-all">
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
