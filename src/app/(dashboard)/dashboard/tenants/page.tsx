import SectionPage from "./components/section-page";
import { serializeData } from "@/lib/helpers/helper";
import {getTenants} from "@/lib/queries/tenantQueries"

export default async function TenantsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const tenants = await getTenants();
  const { success } = await searchParams;

  // Serialize the entire array to handle any Date issues
  const serializedTenants = serializeData(tenants);

  return (
    <>
      <SectionPage
        title="Tenants"
        description="Manage tenant profiles, leases, contacts, and balances."
        tenants={serializedTenants}
        alert={success}
      />
    </>
  );
}
