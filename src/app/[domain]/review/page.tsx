import { notFound } from "next/navigation";
import { getTenantIdByDomain, getTenantData } from "@/lib/supabase/tenant-data";
import ClientReviewForm from "./ClientReviewForm";

export default async function ReviewPage(props: { params: Promise<{ domain: string }>, searchParams: Promise<{ apt?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const aptId = searchParams.apt;

  if (!aptId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <h1 className="text-2xl font-bold">Lien Invalide</h1>
        <p className="text-foreground/60 mt-2">Le lien vers ce formulaire d'avis semble incomplet.</p>
      </div>
    );
  }

  const rawDomain = decodeURIComponent(params.domain);
  const domain = rawDomain.replace(/\.localhost:\d+$/, "").replace(/\.\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\.nip\.io)?(:\d+)?$/, "");

  const tenantId = await getTenantIdByDomain(domain);
  if (!tenantId) notFound();

  const data = await getTenantData(tenantId);
  
  if (!data) notFound();

  const rawAppointments = data.appointments || [];
  const appointment = rawAppointments.find((a: any) => a.id === aptId);

  if (!appointment) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <h1 className="text-2xl font-bold">Rendez-vous Introuvable</h1>
        <p className="text-foreground/60 mt-2">Nous n'avons pas pu trouver ce rendez-vous.</p>
      </div>
    );
  }

  // Check if a review already exists
  const existingReview = (data.reviews || []).find((r: any) => r.appointment_id === aptId);

  const rawServices = data.services || [];
  const service = rawServices.find((s: any) => s.id === appointment.service_id);

  return (
    <ClientReviewForm 
      tenantId={tenantId}
      appointmentId={aptId}
      clientName={appointment.client_name}
      serviceName={service?.name || "Service"}
      date={appointment.date}
      existingReview={existingReview}
      settings={data.settings}
    />
  );
}
