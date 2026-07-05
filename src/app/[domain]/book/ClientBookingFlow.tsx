"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/components/i18n-provider";
import { computeMinDeposit, Service, SalonSettings, Appointment, Staff } from "@/store/salon";
import { addAppointmentAction } from "@/app/actions";
import { Upload, ArrowRight, CheckCircle2, ChevronDown, X, MessageCircle, User } from "lucide-react";
import { WeekCalendar } from "@/components/week-calendar";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type PaymentMethod = "moncash" | "natcash" | "zelle" | "cashapp" | "paypal";
type PayCurrency = "HTG" | "USD";

const methodCurrency: Record<PaymentMethod, PayCurrency> = {
  moncash: "HTG",
  natcash: "HTG",
  zelle: "USD",
  cashapp: "USD",
  paypal: "USD",
};

const uuid = () => crypto.randomUUID?.() ?? ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) => (c ^ (Math.random() * 16 >> c / 4)).toString(16));

interface ClientBookingFlowProps {
  tenantId: string;
  domain: string;
  services: Service[];
  settings: SalonSettings;
  appointments: Partial<Appointment>[];
  staffList?: Staff[];
}

export default function ClientBookingFlow({ tenantId, domain, services, settings, appointments, staffList = [] }: ClientBookingFlowProps) {
  const { t, language } = useI18n();

  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || "");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("any");
  const [detailsModalService, setDetailsModalService] = useState<typeof services[0] | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+509");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("moncash");
  const [amountPaid, setAmountPaid] = useState("");
  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingService, setIsChangingService] = useState(false);
  const [hasSetInitialService, setHasSetInitialService] = useState(false);
  const supabase = createClient();

  // Pre-select service from URL query param
  useEffect(() => {
    if (services && services.length > 0 && !hasSetInitialService) {
      const params = new URLSearchParams(window.location.search);
      const svc = params.get("service");
      if (svc && services.some((s) => s.id === svc)) {
        setSelectedServiceId(svc);
        setIsChangingService(false);
      } else {
        setSelectedServiceId(services[0].id);
        setIsChangingService(true);
      }
      setHasSetInitialService(true);
    }
  }, [services, hasSetInitialService]);

  if (!services || services.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">✂️</span>
        </div>
        <h2 className="text-3xl font-extrabold text-foreground mb-3">Aucun Service</h2>
        <p className="text-foreground/60 font-medium max-w-md mb-8">
          Ce salon n'a pas encore ajouté de services à réserver. Veuillez repasser plus tard !
        </p>
        <Link href="/" className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold shadow-sm hover:opacity-90 transition-opacity">
          Retour à l'accueil
        </Link>
      </div>
    );
  }


  const selectedService = services.find((s) => s.id === selectedServiceId);
  const payCurrency: PayCurrency = methodCurrency[paymentMethod];
  const fullPrice = selectedService ? (payCurrency === "HTG" ? selectedService.priceHTG : selectedService.priceUSD) : 0;
  const minDeposit = selectedService ? computeMinDeposit(selectedService, payCurrency) : 0;

  // Available payment methods based on what the owner configured
  const availableMethods: { key: PaymentMethod; label: string; info: string; currency: PayCurrency }[] = [
    ...(settings.monCashNumber ? [{ key: "moncash" as PaymentMethod, label: "MonCash", info: settings.monCashNumber, currency: "HTG" as PayCurrency }] : []),
    ...(settings.natCashNumber ? [{ key: "natcash" as PaymentMethod, label: "NatCash", info: settings.natCashNumber, currency: "HTG" as PayCurrency }] : []),
    ...(settings.zelleInfo ? [{ key: "zelle" as PaymentMethod, label: "Zelle", info: settings.zelleInfo, currency: "USD" as PayCurrency }] : []),
    ...(settings.cashAppInfo ? [{ key: "cashapp" as PaymentMethod, label: "CashApp", info: settings.cashAppInfo, currency: "USD" as PayCurrency }] : []),
    ...(settings.paypalInfo ? [{ key: "paypal" as PaymentMethod, label: "PayPal", info: settings.paypalInfo, currency: "USD" as PayCurrency }] : []),
  ];

  const selectedMethodInfo = availableMethods.find((m) => m.key === paymentMethod);

  const handleSubmit = async () => {
    if (!selectedService || !fileToUpload) return;
    setIsSubmitting(true);

    try {
      // 1. Upload screenshot to Supabase Storage
      const fileExt = fileName.split('.').pop();
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `appointments/${uniqueFileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, fileToUpload);

      if (uploadError) {
        setIsSubmitting(false);
        return;
      }

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      // 3. Save appointment via Server Action
      await addAppointmentAction(tenantId, domain, {
        id: uuid(),
        clientName: name,
        clientPhone: `${countryCode} ${phone}`,
        clientEmail: email,
        serviceId: selectedServiceId,
        staffId: selectedStaffId,
        serviceName: selectedService.name,
        date,
        time,
        status: "pending",
        screenshotName: publicUrl,
        paymentMethod,
        amountPaid: `${amountPaid} ${payCurrency}`,
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex-1 w-full min-h-[70vh] flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-700">
        <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-50"></div>
          <CheckCircle2 className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{t("book.successTitle")}</h1>
        <p className="text-lg md:text-xl font-medium text-foreground/70 max-w-lg mb-10 leading-relaxed">
          {t("book.successDesc")}
        </p>
        <Link href="/" className="bg-primary text-primary-foreground px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300">
          {t("book.returnHome")}
        </Link>
      </div>
    );
  }

  const inputClass = "w-full bg-background border-2 border-border rounded-2xl p-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground";

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-center text-foreground">{t("book.title")}</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-10 relative px-4">
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-border -z-10 -translate-y-1/2"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step >= i ? "bg-primary text-primary-foreground scale-110 shadow-lg" : "bg-card border-4 border-background text-foreground/50"}`}>
            {i}
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-[2rem] p-6 md:p-10 shadow-xl">

        {/* STEP 1 — Service + Calendar */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-extrabold">{t("book.step1")}</h2>

            {/* Service selector */}
            <div className="space-y-4">
              <div className="flex justify-between items-center ml-2 pr-2">
                <label className="block text-sm font-bold text-foreground/80">Service</label>
                {!isChangingService && (
                  <button onClick={() => setIsChangingService(true)} className="text-sm font-bold text-primary hover:underline">
                    Changer de Service
                  </button>
                )}
              </div>
              
              {isChangingService ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    {services.map((s) => (
                      <div key={s.id} role="button" tabIndex={0} onClick={() => { setSelectedServiceId(s.id); setDate(""); setTime(""); setIsChangingService(false); }}
                        className={`flex flex-col text-left overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${selectedServiceId === s.id ? "border-primary bg-primary/5 ring-4 ring-primary/10 shadow-md" : "border-border hover:border-primary/50 bg-card shadow-sm"}`}>
                        {s.imageUrl ? (
                          <div className="w-full h-32 bg-secondary/30 relative">
                            <Image src={s.imageUrl} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" alt={s.name} />
                            {selectedServiceId === s.id && (
                              <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-sm animate-in zoom-in">
                                <CheckCircle2 size={16} />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-12 bg-secondary/20 flex items-center px-4 relative">
                            {selectedServiceId === s.id && (
                              <div className="absolute top-1/2 -translate-y-1/2 right-4 text-primary animate-in zoom-in">
                                <CheckCircle2 size={18} />
                              </div>
                            )}
                          </div>
                        )}
                        <div className="p-4 flex-1 flex flex-col justify-between w-full">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <p className="font-extrabold text-foreground leading-tight flex-1">{s.name}</p>
                              <p className="text-sm font-medium text-foreground/60 whitespace-nowrap">{s.duration}</p>
                            </div>
                            {s.description && (
                              <p className="text-xs text-foreground/50 line-clamp-2">{s.description}</p>
                            )}
                          </div>
                          <div className="flex justify-between items-end mt-4">
                            <p className="text-primary font-black text-lg">${s.priceUSD} <span className="text-xs text-foreground/50 font-bold ml-1">/ {s.priceHTG.toLocaleString()} HTG</span></p>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setDetailsModalService(s); }} className="text-xs font-bold bg-secondary hover:bg-secondary/80 text-foreground/80 px-4 py-2 rounded-full transition-colors">
                              Détails
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                selectedService && (
                  <div className="flex flex-col sm:flex-row text-left overflow-hidden rounded-2xl border-2 border-primary bg-primary/5 ring-4 ring-primary/10 shadow-md">
                    {selectedService.imageUrl && (
                      <div className="w-full sm:w-48 h-40 sm:h-auto bg-secondary/30 relative shrink-0">
                        <Image src={selectedService.imageUrl} fill sizes="(max-width: 640px) 100vw, 192px" className="object-cover" alt={selectedService.name} />
                        <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-sm">
                          <CheckCircle2 size={16} />
                        </div>
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col justify-between w-full">
                      <div className="space-y-2">
                        <div className="flex flex-col gap-1">
                          <p className="font-extrabold text-xl text-foreground leading-tight">{selectedService.name}</p>
                          <p className="text-sm font-bold text-primary">{selectedService.category}</p>
                        </div>
                        {selectedService.description && (
                          <p className="text-sm text-foreground/60 line-clamp-2 mt-2">{selectedService.description}</p>
                        )}
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <p className="text-primary font-black text-xl">${selectedService.priceUSD} <span className="text-sm text-foreground/50 font-bold ml-1">/ {selectedService.priceHTG.toLocaleString()} HTG</span></p>
                        <p className="text-sm font-bold text-foreground/80 bg-background px-3 py-1.5 rounded-full shadow-sm">{selectedService.duration}</p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Staff Selector */}
            {staffList.length > 0 && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-foreground/80 ml-2">{t("book.staffLabel")}</label>
                <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar px-1">
                  <div role="button" tabIndex={0} onClick={() => { setSelectedStaffId("any"); setDate(""); setTime(""); }}
                    className={`flex-shrink-0 w-32 h-32 flex flex-col items-center justify-center rounded-2xl border-2 transition-all cursor-pointer ${selectedStaffId === "any" ? "border-primary bg-primary/5 ring-4 ring-primary/10 shadow-md" : "border-border hover:border-primary/50 bg-card shadow-sm"}`}>
                    <User className={`w-8 h-8 mb-2 ${selectedStaffId === "any" ? "text-primary" : "text-foreground/40"}`} />
                    <span className="font-bold text-sm">{t("book.anyStaff")}</span>
                  </div>
                  {staffList.map(staff => (
                    <div key={staff.id} role="button" tabIndex={0} onClick={() => { setSelectedStaffId(staff.id); setDate(""); setTime(""); }}
                      className={`flex-shrink-0 w-32 h-32 flex flex-col items-center justify-center rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${selectedStaffId === staff.id ? "border-primary bg-primary/5 ring-4 ring-primary/10 shadow-md" : "border-border hover:border-primary/50 bg-card shadow-sm"}`}>
                      {staff.imageUrl ? (
                        <>
                          <Image src={staff.imageUrl} fill sizes="128px" className="object-cover opacity-60" alt={staff.name} />
                          <div className="absolute inset-0 bg-black/20" />
                          <span className="font-bold text-sm text-white z-10 drop-shadow-md text-center px-2">{staff.name}</span>
                          {selectedStaffId === staff.id && (
                            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-sm z-10">
                              <CheckCircle2 size={12} />
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <User className={`w-8 h-8 mb-2 ${selectedStaffId === staff.id ? "text-primary" : "text-foreground/40"}`} />
                          <span className="font-bold text-sm text-center px-2">{staff.name}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Week Calendar */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground/80 ml-2">{t("book.selectDate")}</label>
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
              className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground p-5 rounded-2xl font-extrabold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity text-lg">
              {t("book.next")} <ArrowRight size={20} />
            </button>
          </div>
        )}


        {/* STEP 2 — Client Info */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-extrabold">{t("book.step2")}</h2>
            <div className="space-y-5">
              <input placeholder={t("book.name")} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              <div className="flex gap-2 sm:gap-3">
                <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-background border-2 border-border rounded-2xl p-4 sm:p-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold min-w-[100px] sm:min-w-[120px]">
                  <option value="+509">🇭🇹 +509</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+33">🇫🇷 +33</option>
                </select>
                <input placeholder={t("book.phone")} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 min-w-0 w-full bg-background border-2 border-border rounded-2xl p-4 sm:p-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium" />
              </div>
              <input placeholder={t("book.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 p-5 rounded-2xl border-2 border-border font-bold hover:bg-secondary transition-colors text-foreground">{t("book.back")}</button>
              <button disabled={!name || (!phone && !email)} onClick={() => setStep(3)}
                className="flex-1 bg-primary text-primary-foreground p-5 rounded-2xl font-extrabold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
                {t("book.next")}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Payment */}
        {step === 3 && selectedService && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-extrabold">{t("book.step3")}</h2>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground/80 ml-2">{t("book.methodLabel")}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableMethods.map((m) => (
                  <button key={m.key} onClick={() => setPaymentMethod(m.key)}
                    className={`p-3 rounded-2xl border-2 font-bold text-sm transition-all duration-200 flex flex-col items-center gap-1 ${paymentMethod === m.key ? "bg-primary text-primary-foreground border-primary scale-105 shadow-md" : "bg-background border-border hover:border-primary/50 text-foreground"}`}>
                    <span>{m.label}</span>
                    <span className={`text-xs font-medium ${paymentMethod === m.key ? "opacity-80" : "opacity-50"}`}>{m.currency}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Deposit Info */}
            {selectedMethodInfo && (
              <div className="bg-secondary/30 rounded-3xl border border-border p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60 font-medium">{t("book.totalPrice")}</span>
                  <span className="text-2xl font-black text-foreground">
                    {payCurrency === "HTG" ? `${fullPrice.toLocaleString()} HTG` : `$${fullPrice}`}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-border pt-4">
                  <span className="text-foreground/60 font-medium">
                    {t("book.minDeposit")}{" "}
                    {selectedService.depositType === "percentage" && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{selectedService.depositPercentage}%</span>
                    )}
                  </span>
                  <span className="text-xl font-extrabold text-primary">
                    {payCurrency === "HTG" ? `${minDeposit.toLocaleString()} HTG` : `$${minDeposit}`}
                  </span>
                </div>

                <p className="text-xs text-foreground/50 font-medium">
                  {t("book.payInfo")}
                </p>

                {/* Payment destination */}
                <div className="bg-background p-4 rounded-2xl border border-border font-mono font-bold text-base shadow-sm">
                  {selectedMethodInfo.label}: {selectedMethodInfo.info}
                </div>

                {/* Amount field */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-foreground/80 ml-1">{t("book.amountSent")} ({payCurrency})</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder={`Min. ${minDeposit.toLocaleString()}`}
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      className={`${inputClass} pr-20`}
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-foreground/40">{payCurrency}</span>
                  </div>
                </div>

                {/* Screenshot Upload */}
                <label className="relative flex flex-col items-center justify-center w-full min-h-[140px] py-8 border-2 border-dashed border-primary rounded-3xl cursor-pointer hover:bg-primary/5 transition-colors bg-background overflow-hidden mt-2 group">
                  {filePreview ? (
                    <>
                      <Image src={filePreview} alt="Preview" fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover opacity-60 group-hover:opacity-30 transition-opacity" />
                      <div className="z-10 flex flex-col items-center justify-center bg-black/60 p-3 rounded-xl backdrop-blur-sm text-center">
                        <CheckCircle2 className="text-green-400 w-8 h-8 mb-1 mx-auto" />
                        <span className="font-bold text-xs text-white max-w-[180px] truncate">{fileName}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="text-primary w-8 h-8 mb-2" />
                      <span className="font-bold text-sm text-center px-4 max-w-[250px] truncate">{fileName ? fileName : t("book.upload")}</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFileToUpload(file);
                      setFileName(file.name);
                      const reader = new FileReader();
                      reader.onload = (e) => setFilePreview(e.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </label>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 p-5 rounded-2xl border-2 border-border font-bold hover:bg-secondary transition-colors text-foreground">{t("book.back")}</button>
                <button
                  disabled={!fileName || !amountPaid || isSubmitting}
                  onClick={handleSubmit}
                  className="flex-[2] flex items-center justify-center gap-2 bg-primary text-primary-foreground p-5 rounded-2xl font-extrabold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-40 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><CheckCircle2 size={20} /> {t("book.confirm")}</>
                  )}
                </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {detailsModalService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl relative">
            <button onClick={() => setDetailsModalService(null)} className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors z-10">
              <X size={20} />
            </button>
            {detailsModalService.imageUrl && (
              <div className="relative w-full h-64 bg-secondary">
                <Image src={detailsModalService.imageUrl} alt={detailsModalService.name} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
              </div>
            )}
            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-black text-foreground leading-tight">{detailsModalService.name}</h3>
                {detailsModalService.category && (
                  <span className="inline-block mt-3 text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">{detailsModalService.category}</span>
                )}
              </div>
              
              {detailsModalService.description ? (
                <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap text-sm font-medium">
                  {detailsModalService.description}
                </div>
              ) : (
                <p className="text-foreground/50 text-sm italic">Aucune description disponible.</p>
              )}

              <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                  <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Durée & Prix</p>
                  <p className="text-sm font-extrabold text-foreground">{detailsModalService.duration} • <span className="text-primary text-xl">${detailsModalService.priceUSD}</span></p>
                </div>
                <div className="flex w-full sm:w-auto gap-3">
                  {settings?.whatsappVisibility === "inline" && settings?.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] px-4 py-3 rounded-2xl font-bold shadow-sm hover:bg-[#25D366]/20 transition-all whitespace-nowrap">
                      <MessageCircle size={18} /> Poser une question
                    </a>
                  )}
                  <button onClick={() => { setSelectedServiceId(detailsModalService.id); setDate(""); setTime(""); setDetailsModalService(null); }} 
                    className="flex-1 sm:flex-none bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold shadow-lg hover:opacity-90 hover:scale-105 transition-all">
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
