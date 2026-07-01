"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/components/i18n-provider";
import { useSalonStore, computeMinDeposit } from "@/store/salon";
import { Calendar, Upload, ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import Link from "next/link";

type PaymentMethod = "moncash" | "natcash" | "zelle" | "cashapp" | "paypal";
type PayCurrency = "HTG" | "USD";

const methodCurrency: Record<PaymentMethod, PayCurrency> = {
  moncash: "HTG",
  natcash: "HTG",
  zelle: "USD",
  cashapp: "USD",
  paypal: "USD",
};

export default function BookPage() {
  const { t } = useI18n();
  const { services, settings, addAppointment } = useSalonStore();

  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+509");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("moncash");
  const [amountPaid, setAmountPaid] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Pre-select service from URL query param
  useEffect(() => {
    if (services && services.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const svc = params.get("service");
      if (svc && services.some((s) => s.id === svc)) {
        setSelectedServiceId(svc);
      } else if (!selectedServiceId) {
        setSelectedServiceId(services[0].id);
      }
    }
  }, [services, selectedServiceId]);

  // Guard: wait for Zustand store to hydrate from localStorage
  if (!services || services.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const timeSlots = ["09:00", "10:00", "11:30", "13:00", "15:00", "16:30"];

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

  const handleSubmit = () => {
    if (!selectedService) return;
    addAppointment({
      id: crypto.randomUUID(),
      clientName: name,
      clientPhone: `${countryCode} ${phone}`,
      clientEmail: email,
      serviceId: selectedServiceId,
      serviceName: selectedService.name,
      date,
      time,
      status: "pending",
      screenshotName: fileName,
      paymentMethod,
      amountPaid: `${amountPaid} ${payCurrency}`,
      createdAt: new Date().toISOString(),
    });
    setSubmitted(true);
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

        {/* STEP 1 — Service + Date + Time */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-extrabold flex items-center gap-3">
              <Calendar className="text-primary w-8 h-8" /> {t("book.step1")}
            </h2>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground/80 ml-2">Service</label>
              <div className="relative">
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className={`${inputClass} appearance-none pr-10`}
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — ${s.priceUSD} / {s.priceHTG.toLocaleString()} HTG ({s.duration})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground/80 ml-2">{t("book.selectDate")}</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
            </div>

            {date && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-2">
                <label className="block text-sm font-bold text-foreground/80 ml-2">{t("book.selectTime")}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <button key={slot} onClick={() => setTime(slot)}
                      className={`p-4 rounded-2xl border-2 font-bold transition-all duration-300 ${time === slot ? "bg-primary text-primary-foreground border-primary scale-105 shadow-md" : "bg-background border-border hover:border-primary/50 text-foreground"}`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
              <div className="flex gap-3">
                <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-background border-2 border-border rounded-2xl p-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold min-w-[120px]">
                  <option value="+509">🇭🇹 +509</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+33">🇫🇷 +33</option>
                </select>
                <input placeholder={t("book.phone")} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 bg-background border-2 border-border rounded-2xl p-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium" />
              </div>
              <input placeholder={t("book.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 p-5 rounded-2xl border-2 border-border font-bold hover:bg-secondary transition-colors text-foreground">{t("book.back")}</button>
              <button disabled={!name || !phone || !email} onClick={() => setStep(3)}
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
                <label className="flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-primary rounded-3xl cursor-pointer hover:bg-primary/5 transition-colors bg-background mt-2">
                  <Upload className="text-primary w-8 h-8 mb-2" />
                  <span className="font-bold text-sm">{fileName ? fileName : t("book.upload")}</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
                </label>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 p-5 rounded-2xl border-2 border-border font-bold hover:bg-secondary transition-colors text-foreground">{t("book.back")}</button>
              <button
                disabled={!fileName || !amountPaid}
                onClick={handleSubmit}
                className="flex-[2] flex items-center justify-center gap-2 bg-primary text-primary-foreground p-5 rounded-2xl font-extrabold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-40 disabled:cursor-not-allowed">
                <CheckCircle2 size={20} /> {t("book.confirm")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
