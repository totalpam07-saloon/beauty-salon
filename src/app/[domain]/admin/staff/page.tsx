import { notFound } from "next/navigation";
import { getTenantIdByDomain, getTenantData } from "@/lib/supabase/tenant-data";
import ClientStaffManager from "./ClientStaffManager";

export default async function StaffPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const rawDomain = decodeURIComponent(params.domain);
  const domain = rawDomain.replace(/\.localhost:\d+$/, "").replace(/\.\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\.nip\.io)?(:\d+)?$/, "");

  const tenantId = await getTenantIdByDomain(domain);
  if (!tenantId) notFound();

  const data = await getTenantData(tenantId);
  
  if (!data) notFound();

  const rawStaff = data.staff || [];

  const staff = rawStaff.map((s: any) => ({
    id: s.id,
    name: s.name,
    role: s.role,
    imageUrl: s.image_url,
  }));

  return (
    <ClientStaffManager 
      tenantId={tenantId}
      domain={domain}
      staffList={staff} 
    />
  );
}
