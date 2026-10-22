import SectionPage from "./components/section-page";
import { serializeData } from "@/lib/helpers/helper";
import {
  getTenants,
  getLeasedTenant,
  expiringSoonTenants,
  NewTenant,
  getNotLeasedTenant,
} from "@/lib/queries/tenantQueries";

export default async function TenantsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const tenants = await getTenants();
  const { success } = await searchParams;
  const leasedTenants = await getLeasedTenant()
  const newTenants = await NewTenant();
  const expiringTenants = await expiringSoonTenants();
  const unleasedTenants = await getNotLeasedTenant();

  // Serialize the entire array to handle any Date issues
  const serializedTenants = serializeData(tenants);

  return (
    <>
      <SectionPage
        title="Tenants"
        description="Manage tenant profiles, leases, contacts, and balances."
        tenants={serializedTenants}
        alert={success}
        leasedTenants={leasedTenants}
        newTenants={newTenants}
        expiringTenants={expiringTenants}
        unleasedTenants={unleasedTenants}
      />
    </>
  );
}
