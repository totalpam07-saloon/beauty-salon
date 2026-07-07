import { useState, useEffect } from "react";
import { useI18n } from "@/components/i18n-provider";
import { computeMinDeposit, Service, SalonSettings, Appointment, Staff } from "@/store/salon";
import { addAppointmentAction } from "@/app/actions";
import { createClient } from "@/lib/supabase/client";

export type PaymentMethod = "moncash" | "natcash" | "zelle" | "cashapp" | "paypal";
export type PayCurrency = "HTG" | "USD";

export const methodCurrency: Record<PaymentMethod, PayCurrency> = {
  moncash: "HTG",
  natcash: "HTG",
  zelle: "USD",
  cashapp: "USD",
  paypal: "USD",
};

export const uuid = () => crypto.randomUUID?.() ?? ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) => (c ^ (Math.random() * 16 >> c / 4)).toString(16));

export function useBookingFlow({
  tenantId,
  domain,
  services,
  settings,
  appointments,
  staffList = []
}: {
  tenantId: string;
  domain: string;
  services: Service[];
  settings: SalonSettings;
  appointments: Partial<Appointment>[];
  staffList?: Staff[];
}) {
  const { t, language } = useI18n();
  const supabase = createClient();

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return {
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
    setFileName,
    filePreview,
    setFilePreview,
    fileToUpload,
    setFileToUpload,
    submitted,
    setSubmitted,
    isSubmitting,
    setIsSubmitting,
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
  };
}
