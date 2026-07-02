import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getTenantIdByDomain(domain: string) {
  const supabase = await createClient();
  const { data: tenant } = await supabase.rpc("get_tenant_id_by_domain", { req_domain: domain });
  return tenant;
}

export function getCachedTenantData(domain: string) {
  return unstable_cache(
    async (id: string) => {
      const supabase = await createClient();
      const { data } = await supabase
        .from("tenants")
        .select(`
          salon_settings (*),
          services (*),
          appointments (*),
          portfolio (*)
        `)
        .eq("id", id)
        .single();
      return data;
    },
    [`tenant-data-${domain}`],
    { revalidate: 60, tags: [`tenant-${domain}`] }
  );
}
