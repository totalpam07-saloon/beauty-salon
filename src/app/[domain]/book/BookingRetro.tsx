import { ArrowRight, CheckCircle2, ChevronDown, MessageCircle, User, Upload, X } from "lucide-react";
import { WeekCalendar } from "@/components/week-calendar";
import Link from "next/link";
import Image from "next/image";
import { Service, SalonSettings, Appointment, Staff } from "@/store/salon";
import { useBookingFlow } from "./useBookingFlow";
export function BookingRetro({
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

  const inputClass = "w-full bg-white border-4 border-[#FFD166] rounded-2xl p-4 outline-none focus:border-[#FF8A5B] transition-all font-bold text-[#4A3B2C] shadow-[0_4px_0_0_#FFD166] focus:shadow-[0_4px_0_0_#FF8A5B] placeholder:text-[#4A3B2C]/40 placeholder:font-medium";

  const renderNav = () => null;

  if (!services || services.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFFDF5] font-serif text-[#4A3B2C]">
        {renderNav()}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 mt-20 animate-in fade-in duration-700">
          <div className="w-24 h-24 bg-[#FFD166] border-4 border-[#FF8A5B] rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_8px_0_0_#FF8A5B] rotate-6">
            <span className="text-4xl">✂️</span>
          </div>
          <h2 className="text-4xl font-black mb-4">Aucun Service</h2>
          <p className="font-medium text-[#6B5A4B] max-w-md mb-8 italic text-lg">
            Ce salon n'a pas encore ajouté de services à réserver. Veuillez repasser plus tard !
          </p>
          <Link href="/" className="bg-[#FF8A5B] text-white px-8 py-4 rounded-full font-black text-lg shadow-[0_6px_0_0_#E06D43] hover:-translate-y-1 hover:shadow-[0_8px_0_0_#E06D43] transition-all">
            Retour à l'accueil
          </Link>
        </div>
        
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFFDF5] font-serif text-[#4A3B2C]">
        {renderNav()}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 mt-20 animate-in fade-in duration-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTQ0MCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGRDE2NiIgZmlsbC1vcGFjaXR5PSIwLjEiIGQ9Ik0wIDI1Nmw0OCAtMTAuN0M5NiAyMzUgNDkgMTky NDkgMTI4UzI4OCAyMSAzODQgMzJsOTYgMTAuN0M1NzYgNTMgNjcyIDg1IDc2OCA4NS4zUzEwNTYgNTMgMTE1MiA1M0wxNDQwIDUzbDAgMzIwbC0xNDQwIDB6Ii8+PC9zdmc+')] bg-cover bg-bottom opacity-50 z-0"></div>
          <div className="w-32 h-32 bg-white border-4 border-[#FF8A5B] rounded-[3rem] flex items-center justify-center mb-8 shadow-[0_12px_0_0_#FFD166] -rotate-6 relative z-10">
            <CheckCircle2 className="w-16 h-16 text-[#FF8A5B]" strokeWidth={3} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-[2px_2px_0_#FFD166] relative z-10">{t("book.successTitle")}</h1>
          <p className="text-xl font-bold text-[#6B5A4B] max-w-lg mb-10 italic relative z-10">
            {t("book.successDesc")}
          </p>
          <Link href="/" className="bg-[#FF8A5B] text-white px-10 py-5 rounded-full font-black text-xl shadow-[0_8px_0_0_#E06D43] hover:-translate-y-2 hover:shadow-[0_12px_0_0_#E06D43] transition-all relative z-10">
            {t("book.returnHome")}
          </Link>
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF5] font-serif text-[#4A3B2C] selection:bg-[#FF8A5B] selection:text-white">
      {renderNav()}
      
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-32 relative z-10">
        <h1 className="text-4xl md:text-6xl font-black mb-16 text-center drop-shadow-[3px_3px_0_#FFD166]">{t("book.title")}</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-16 relative px-4 max-w-md mx-auto">
          <div className="absolute top-1/2 left-4 right-4 h-2 bg-[#FFD166] -z-10 -translate-y-1/2 rounded-full border border-[#4A3B2C]/10"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-14 h-14 flex items-center justify-center font-black text-2xl border-4 transition-all duration-300 rounded-full ${step >= i ? "bg-[#FF8A5B] border-white text-white scale-110 shadow-[0_4px_0_0_#E06D43]" : "bg-[#FFFDF5] border-[#FFD166] text-[#FFD166]"}`}>
              {i}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-[0_16px_0_0_rgba(255,138,91,0.15)] border-4 border-[#FFD166]/30">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <h2 className="text-3xl font-black text-center text-[#FF8A5B] drop-shadow-[1px_1px_0_rgba(74,59,44,0.2)]">{t("book.step1")}</h2>

              {/* Service selector */}
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-[#FFFDF5] border-4 border-[#FFD166] p-4 rounded-[2rem] shadow-[0_4px_0_0_rgba(255,209,102,0.5)]">
                  <label className="block text-lg font-bold text-[#4A3B2C] ml-2">Service</label>
                  {!isChangingService && (
                    <button onClick={() => setIsChangingService(true)} className="text-sm font-black text-white bg-[#FF8A5B] px-4 py-2 rounded-full shadow-[0_4px_0_0_#E06D43] hover:-translate-y-1 hover:shadow-[0_6px_0_0_#E06D43] transition-all">
                      Changer
                    </button>
                  )}
                </div>
                
                {isChangingService ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[450px] overflow-y-auto p-2 no-scrollbar">
                    {services.map((s) => (
                      <div key={s.id} role="button" tabIndex={0} onClick={() => { setSelectedServiceId(s.id); setDate(""); setTime(""); setIsChangingService(false); }}
                        className={`flex flex-col text-left overflow-hidden rounded-[2.5rem] transition-all cursor-pointer border-4 ${selectedServiceId === s.id ? "border-[#FF8A5B] bg-[#FFFDF5] shadow-[0_8px_0_0_#FF8A5B] -translate-y-2" : "border-[#FFD166] bg-white shadow-[0_6px_0_0_#FFD166] hover:-translate-y-1 hover:shadow-[0_8px_0_0_#FFD166]"}`}>
                        {s.imageUrl && (
                          <div className="w-full h-36 bg-[#FFFDF5] border-b-4 border-[#FFD166] relative p-2">
                            <div className="w-full h-full rounded-2xl overflow-hidden relative">
                              <Image src={s.imageUrl} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover sepia-[.2]" alt={s.name} />
                              {selectedServiceId === s.id && (
                                <div className="absolute top-2 right-2 bg-white text-[#FF8A5B] border-4 border-[#FF8A5B] rounded-full p-1 shadow-sm">
                                  <CheckCircle2 size={16} strokeWidth={4} />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col justify-between w-full">
                          <div className="space-y-2 mb-4">
                            <p className="font-black text-xl leading-tight">{s.name}</p>
                            <p className="text-sm font-bold text-[#6B5A4B] italic">{s.duration}</p>
                          </div>
                          <div className="flex justify-between items-end mt-auto">
                            <p className="font-black text-2xl text-[#FF8A5B]">${s.priceUSD}</p>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setDetailsModalService(s); }} className="text-xs font-black uppercase text-[#6B5A4B] bg-[#FFFDF5] border-2 border-[#FFD166] px-3 py-1.5 rounded-xl hover:border-[#FF8A5B] transition-colors">
                              Détails
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  selectedService && (
                    <div className="flex flex-col sm:flex-row text-left overflow-hidden rounded-[3rem] border-4 border-[#FF8A5B] bg-[#FFFDF5] shadow-[0_12px_0_0_rgba(255,138,91,0.2)]">
                      {selectedService.imageUrl && (
                        <div className="w-full sm:w-56 h-48 sm:h-auto bg-[#FFD166]/20 border-r-4 border-[#FF8A5B] relative shrink-0 p-3">
                          <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                            <Image src={selectedService.imageUrl} fill sizes="(max-width: 640px) 100vw, 224px" className="object-cover sepia-[.2]" alt={selectedService.name} />
                            <div className="absolute top-2 left-2 bg-white text-[#FF8A5B] border-4 border-[#FF8A5B] rounded-full p-1 shadow-sm">
                              <CheckCircle2 size={20} strokeWidth={4} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between w-full">
                        <div className="space-y-2 relative">
                          <p className="text-xs font-black uppercase text-[#FF8A5B] tracking-widest">{selectedService.category}</p>
                          <p className="font-black text-3xl leading-tight">{selectedService.name}</p>
                        </div>
                        <div className="flex justify-between items-end mt-8">
                          <div className="relative">
                            <p className="font-black text-4xl text-[#FF8A5B] drop-shadow-[2px_2px_0_#FFF]">${selectedService.priceUSD}</p>
                            <div className="absolute -bottom-4 -right-2 bg-[#FF8A5B] text-white font-black px-5 py-2 rounded-full shadow-[0_4px_0_0_#E06D43] rotate-[-5deg] flex flex-col items-center justify-center leading-none">
                              <span className="text-xs">HTG</span>
                              <span className="text-base">{selectedService.priceHTG.toLocaleString()}</span>
                            </div>
                          </div>
                          <p className="text-base font-bold text-[#6B5A4B] bg-white border-4 border-[#FFD166] px-4 py-2 rounded-2xl shadow-[0_4px_0_0_rgba(255,209,102,0.5)] rotate-3">{selectedService.duration}</p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Staff Selector */}
              {staffList.length > 0 && (
                <div className="space-y-6">
                  <label className="block text-lg font-bold text-[#4A3B2C] ml-2">{t("book.staffLabel")}</label>
                  <div className="flex overflow-x-auto pb-6 gap-6 no-scrollbar px-2">
                    <div role="button" tabIndex={0} onClick={() => { setSelectedStaffId("any"); setDate(""); setTime(""); }}
                      className={`flex-shrink-0 w-32 h-32 flex flex-col items-center justify-center rounded-[2.5rem] border-4 transition-all cursor-pointer ${selectedStaffId === "any" ? "border-[#FF8A5B] bg-[#FFFDF5] shadow-[0_8px_0_0_#FF8A5B] -translate-y-2" : "border-[#FFD166] bg-white shadow-[0_6px_0_0_#FFD166] hover:-translate-y-1 hover:shadow-[0_8px_0_0_#FFD166]"}`}>
                      <User className={`w-10 h-10 mb-2 ${selectedStaffId === "any" ? "text-[#FF8A5B]" : "text-[#FFD166]"}`} strokeWidth={3} />
                      <span className="font-bold text-sm text-center leading-tight">{t("book.anyStaff")}</span>
                    </div>
                    {staffList.map(staff => (
                      <div key={staff.id} role="button" tabIndex={0} onClick={() => { setSelectedStaffId(staff.id); setDate(""); setTime(""); }}
                        className={`flex-shrink-0 w-32 h-32 flex flex-col items-center justify-center rounded-[2.5rem] border-4 transition-all cursor-pointer relative overflow-hidden ${selectedStaffId === staff.id ? "border-[#FF8A5B] shadow-[0_8px_0_0_#FF8A5B] -translate-y-2" : "border-[#FFD166] bg-white shadow-[0_6px_0_0_#FFD166] hover:-translate-y-1 hover:shadow-[0_8px_0_0_#FFD166]"}`}>
                        {staff.imageUrl ? (
                          <>
                            <Image src={staff.imageUrl} fill sizes="128px" className="object-cover sepia-[.2]" alt={staff.name} />
                            <div className="absolute inset-0 bg-[#4A3B2C]/20" />
                            <span className="font-bold text-sm text-white z-10 drop-shadow-md text-center px-1 leading-tight">{staff.name}</span>
                            {selectedStaffId === staff.id && (
                              <div className="absolute top-2 right-2 bg-white border-2 border-[#FF8A5B] text-[#FF8A5B] rounded-full p-0.5 z-10">
                                <CheckCircle2 size={14} strokeWidth={4} />
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <User className={`w-10 h-10 mb-2 ${selectedStaffId === staff.id ? "text-[#FF8A5B]" : "text-[#FFD166]"}`} strokeWidth={3} />
                            <span className="font-bold text-sm text-center leading-tight px-1">{staff.name}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Week Calendar */}
              <div className="space-y-6">
                <label className="block text-lg font-bold text-[#4A3B2C] ml-2">{t("book.selectDate")}</label>
                {selectedService && (
                  <div className="bg-[#FFFDF5] border-4 border-[#FFD166] rounded-[3rem] p-2 shadow-[0_8px_0_0_rgba(255,209,102,0.3)]">
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
                className="w-full flex items-center justify-center gap-3 bg-[#FF8A5B] text-white p-6 rounded-full font-black text-xl disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-2 hover:shadow-[0_12px_0_0_#E06D43] transition-all shadow-[0_8px_0_0_#E06D43] mt-8">
                {t("book.next")} <ArrowRight size={24} strokeWidth={3} />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-black text-center text-[#FF8A5B] drop-shadow-[1px_1px_0_rgba(74,59,44,0.2)]">{t("book.step2")}</h2>
              <div className="space-y-8 bg-[#FFFDF5] p-8 rounded-[3rem] border-4 border-[#FFD166] shadow-inner">
                <input placeholder={t("book.name")} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                <div className="flex gap-4">
                  <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-white border-4 border-[#FFD166] rounded-2xl p-4 outline-none focus:border-[#FF8A5B] transition-all font-bold text-[#4A3B2C] shadow-[0_4px_0_0_#FFD166] min-w-[120px]">
                    <option value="+509">HT +509</option>
                    <option value="+1">US +1</option>
                    <option value="+33">FR +33</option>
                  </select>
                  <input placeholder={t("book.phone")} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`flex-1 ${inputClass}`} />
                </div>
                <input placeholder={t("book.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </div>
              <div className="flex gap-6 pt-6">
                <button onClick={() => setStep(1)} className="flex-1 p-5 rounded-full border-4 border-[#FFD166] bg-white font-black text-[#6B5A4B] hover:bg-[#FFFDF5] hover:-translate-y-1 hover:shadow-[0_4px_0_0_#FFD166] transition-all">{t("book.back")}</button>
                <button disabled={!name || (!phone && !email)} onClick={() => setStep(3)}
                  className="flex-[2] bg-[#FF8A5B] text-white p-5 rounded-full font-black text-xl shadow-[0_8px_0_0_#E06D43] hover:-translate-y-2 hover:shadow-[0_12px_0_0_#E06D43] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0">
                  {t("book.next")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && selectedService && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-black text-center text-[#FF8A5B] drop-shadow-[1px_1px_0_rgba(74,59,44,0.2)]">{t("book.step3")}</h2>

              {/* Payment Method Selector */}
              <div className="space-y-6">
                <label className="block text-lg font-bold text-[#4A3B2C] ml-2">{t("book.methodLabel")}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {availableMethods.map((m) => (
                    <button key={m.key} onClick={() => setPaymentMethod(m.key)}
                      className={`p-4 rounded-[2rem] border-4 transition-all flex flex-col items-center justify-center gap-2 min-h-[100px] ${paymentMethod === m.key ? "border-[#FF8A5B] bg-[#FFFDF5] shadow-[0_6px_0_0_#FF8A5B] -translate-y-1" : "border-[#FFD166] bg-white hover:bg-[#FFFDF5] hover:-translate-y-1 hover:shadow-[0_6px_0_0_#FFD166] shadow-[0_4px_0_0_rgba(255,209,102,0.3)]"}`}>
                      <span className="font-black text-[#4A3B2C] text-lg">{m.label}</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${paymentMethod === m.key ? "bg-[#FF8A5B] text-white" : "bg-[#FFD166]/20 text-[#6B5A4B]"}`}>{m.currency}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Deposit Info */}
              {selectedMethodInfo && (
                <div className="bg-[#FFFDF5] border-4 border-[#FFD166] rounded-[3rem] p-8 md:p-10 space-y-8 shadow-[0_8px_0_0_rgba(255,209,102,0.3)]">
                  <div className="flex justify-between items-center pb-6 border-b-4 border-[#FFD166]/30">
                    <span className="text-[#6B5A4B] font-bold text-lg">{t("book.totalPrice")}</span>
                    <span className="text-2xl font-black text-[#4A3B2C]">
                      {payCurrency === "HTG" ? `${fullPrice.toLocaleString()} HTG` : `$${fullPrice}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#4A3B2C] font-bold text-lg flex items-center gap-3">
                      {t("book.minDeposit")}
                      {selectedService.depositType === "percentage" && (
                        <span className="text-sm bg-white border-2 border-[#FFD166] text-[#FF8A5B] px-3 py-1 rounded-full shadow-sm">{selectedService.depositPercentage}%</span>
                      )}
                    </span>
                    <span className="text-4xl font-black text-[#FF8A5B] drop-shadow-[2px_2px_0_#FFF]">
                      {payCurrency === "HTG" ? `${minDeposit.toLocaleString()} HTG` : `$${minDeposit}`}
                    </span>
                  </div>

                  <p className="text-base text-[#6B5A4B] font-medium bg-white p-6 rounded-3xl shadow-[0_4px_0_0_rgba(74,59,44,0.1)] border-2 border-[#FFD166] rotate-1">
                    {t("book.payInfo")}
                  </p>

                  {/* Payment destination */}
                  <div className="bg-white p-6 rounded-3xl border-4 border-[#FF8A5B] font-black text-xl text-center shadow-[0_6px_0_0_rgba(255,138,91,0.2)] -rotate-1">
                    <span className="text-[#6B5A4B] mr-2">{selectedMethodInfo.label}:</span>
                    <span className="text-[#FF8A5B]">{selectedMethodInfo.info}</span>
                  </div>

                  {/* Amount field */}
                  <div className="space-y-4 pt-6">
                    <label className="block text-sm font-bold text-[#4A3B2C] ml-2">{t("book.amountSent")} ({payCurrency})</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={`Min. ${minDeposit.toLocaleString()}`}
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        className="w-full bg-white border-4 border-[#FFD166] rounded-2xl p-5 pr-20 outline-none focus:border-[#FF8A5B] transition-all font-black text-2xl text-[#4A3B2C] shadow-[0_4px_0_0_#FFD166] focus:shadow-[0_4px_0_0_#FF8A5B]"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-xl text-[#FFD166]">{payCurrency}</span>
                    </div>
                  </div>

                  {/* Screenshot Upload */}
                  <div className="pt-4">
                    <label className="relative flex flex-col items-center justify-center w-full min-h-[180px] py-10 border-4 border-dashed border-[#FFD166] rounded-[3rem] cursor-pointer hover:bg-white transition-colors bg-white/50 overflow-hidden group">
                      {filePreview ? (
                        <>
                          <Image src={filePreview} alt="Preview" fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover opacity-60 sepia-[.3]" />
                          <div className="z-10 flex flex-col items-center justify-center bg-white border-4 border-[#FF8A5B] p-4 rounded-2xl shadow-[0_4px_0_0_#FF8A5B] text-center group-hover:scale-110 transition-transform rotate-3">
                            <CheckCircle2 className="text-[#FF8A5B] w-12 h-12 mb-2 mx-auto" strokeWidth={3} />
                            <span className="font-bold text-sm text-[#4A3B2C] max-w-[180px] truncate">{fileName}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-20 h-20 bg-white border-4 border-[#FFD166] rounded-full flex items-center justify-center mb-4 shadow-[0_4px_0_0_#FFD166] group-hover:rotate-12 transition-transform">
                            <Upload className="text-[#FF8A5B] w-10 h-10" strokeWidth={3} />
                          </div>
                          <span className="font-black text-base text-[#6B5A4B] text-center px-4">{fileName ? fileName : t("book.upload")}</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-6 pt-6">
                <button onClick={() => setStep(2)} className="flex-1 p-5 rounded-full border-4 border-[#FFD166] bg-white font-black text-[#6B5A4B] hover:bg-[#FFFDF5] hover:-translate-y-1 hover:shadow-[0_4px_0_0_#FFD166] transition-all">{t("book.back")}</button>
                <button
                  disabled={!fileName || !amountPaid || isSubmitting}
                  onClick={handleSubmit}
                  className="flex-[2] flex items-center justify-center gap-3 bg-[#FF8A5B] text-white p-5 rounded-full font-black text-xl shadow-[0_8px_0_0_#E06D43] hover:-translate-y-2 hover:shadow-[0_12px_0_0_#E06D43] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0">
                  {isSubmitting ? (
                    <div className="w-8 h-8 border-4 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><CheckCircle2 size={28} strokeWidth={3} /> {t("book.confirm")}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {detailsModalService && (
        <div className="fixed inset-0 z-50 bg-[#4A3B2C]/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="bg-[#FFFDF5] border-4 border-[#FFD166] rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-[0_20px_0_0_rgba(255,138,91,0.2)] relative flex flex-col">
            <button onClick={() => setDetailsModalService(null)} className="absolute top-6 right-6 bg-white border-4 border-[#FF8A5B] text-[#FF8A5B] rounded-full p-2.5 hover:bg-[#FF8A5B] hover:text-white transition-colors z-20 shadow-[0_4px_0_0_#FFD166]">
              <X size={24} strokeWidth={3} />
            </button>
            {detailsModalService.imageUrl && (
              <div className="relative w-full h-72 bg-[#FFD166]/20 border-b-4 border-[#FFD166] p-4">
                <div className="w-full h-full rounded-[2rem] overflow-hidden relative border-4 border-white">
                  <Image src={detailsModalService.imageUrl} alt={detailsModalService.name} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover sepia-[.2]" />
                </div>
              </div>
            )}
            <div className="p-8 md:p-12 space-y-8 relative z-10 bg-[#FFFDF5]">
              <div>
                <h3 className="text-4xl md:text-5xl font-black text-[#4A3B2C] leading-tight mb-4 drop-shadow-[2px_2px_0_#FFD166]">{detailsModalService.name}</h3>
                {detailsModalService.category && (
                  <span className="inline-block text-xs font-black bg-white border-4 border-[#FFD166] text-[#FF8A5B] px-4 py-2 rounded-2xl shadow-[0_4px_0_0_rgba(255,209,102,0.5)] uppercase tracking-wider -rotate-2">{detailsModalService.category}</span>
                )}
              </div>
              
              {detailsModalService.description ? (
                <div className="text-[#6B5A4B] font-medium leading-relaxed whitespace-pre-wrap bg-white border-4 border-[#FFD166]/30 p-6 rounded-3xl text-lg">
                  {detailsModalService.description}
                </div>
              ) : (
                <p className="text-[#6B5A4B]/50 italic font-bold">Aucune description disponible.</p>
              )}

              <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-8 border-t-4 border-[#FFD166]/30">
                <div className="w-full md:w-auto text-center md:text-left bg-white border-4 border-[#FF8A5B] px-8 py-5 rounded-[2rem] shadow-[0_6px_0_0_rgba(255,138,91,0.2)] rotate-1">
                  <p className="text-sm font-bold text-[#6B5A4B] uppercase tracking-widest mb-1">Durée & Prix</p>
                  <p className="font-black text-[#4A3B2C] text-xl">{detailsModalService.duration} <span className="mx-2 text-[#FFD166]">|</span> <span className="text-3xl text-[#FF8A5B] drop-shadow-[2px_2px_0_#FFF]">${detailsModalService.priceUSD} <span className="text-sm opacity-70 ml-2 font-bold whitespace-nowrap">/ {detailsModalService.priceHTG.toLocaleString()} HTG</span></span></p>
                </div>
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
                  {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center bg-[#25D366] border-4 border-[#25D366] text-white px-6 py-4 rounded-[2rem] shadow-[0_6px_0_0_rgba(37,211,102,0.3)] hover:-translate-y-1 transition-transform">
                      <MessageCircle size={28} strokeWidth={2.5} />
                    </a>
                  )}
                  <button onClick={() => { setSelectedServiceId(detailsModalService.id); setDate(""); setTime(""); setDetailsModalService(null); }} 
                    className="flex-1 bg-[#FF8A5B] text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-[0_8px_0_0_#E06D43] hover:-translate-y-2 hover:shadow-[0_12px_0_0_#E06D43] transition-all">
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
