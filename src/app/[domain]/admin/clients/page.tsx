import { notFound } from "next/navigation";
import { getTenantIdByDomain, getTenantData } from "@/lib/supabase/tenant-data";
import ClientClientsList from "./ClientClientsList";

export default async function ClientsPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const rawDomain = decodeURIComponent(params.domain);
  const domain = rawDomain.replace(/\.localhost:\d+$/, "").replace(/\.\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\.nip\.io)?(:\d+)?$/, "");

  const tenantId = await getTenantIdByDomain(domain);
  if (!tenantId) notFound();

  const data = await getTenantData(tenantId);
  
  if (!data) notFound();

  const rawAppointments = data.appointments || [];
  const rawServices = data.services || [];

  const services = rawServices.map((s: any) => ({
    id: s.id,
    name: s.name,
  }));

  const appointments = rawAppointments.map((a: any) => ({
    id: a.id,
    clientName: a.client_name,
    clientPhone: a.client_phone,
    clientEmail: a.client_email,
    serviceId: a.service_id,
    serviceName: services.find((s: any) => s.id === a.service_id)?.name || "Service",
    date: a.date,
    time: a.time,
    status: a.status,
    screenshotName: a.deposit_receipt_url,
    paymentMethod: a.payment_method || "",
    amountPaid: a.amount_paid || "",
    createdAt: a.created_at
  }));

  const clients = data.clients || [];

  return (
    <ClientClientsList 
      tenantId={tenantId}
      domain={domain}
      appointments={appointments}
      dbClients={clients}
    />
  );
}
