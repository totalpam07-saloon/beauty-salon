import { createClient } from "@/lib/supabase/server";

/**
 * Get tenant ID by subdomain — direct query, no RPC.
 * This is the single source of truth for tenant lookup.
 */
export async function getTenantIdByDomain(domainQuery: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tenants")
    .select("id")
    .or(`subdomain.eq.${domainQuery},domain.eq.${domainQuery}`)
    .single();
  if (error || !data) return null;
  return data.id as string;
}

/**
 * Fetch all tenant data needed to render a salon page.
 */
export async function getTenantData(id: string) {
  const supabase = await createClient();
  
  // Fetch tenant info
  const { data: tenant } = await supabase.from("tenants").select("*").eq("id", id).single();
  
  // Fetch related tables separately to guarantee they return data and avoid PostgREST join bugs
  const { data: settings } = await supabase.from("salon_settings").select("*").eq("tenant_id", id);
  const { data: services } = await supabase.from("services").select("*").eq("tenant_id", id);
  const { data: appointments } = await supabase.from("appointments").select("*").eq("tenant_id", id);
  const { data: portfolio } = await supabase.from("portfolio").select("*").eq("tenant_id", id);

  return {
    ...tenant,
    salon_settings: settings || [],
    services: services || [],
    appointments: appointments || [],
    portfolio: portfolio || []
  };
}
