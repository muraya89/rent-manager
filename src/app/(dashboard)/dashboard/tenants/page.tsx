import SectionPage from "./components/section-page";
import { prisma } from "@/lib/prisma";
import { serializeData } from "@/lib/helpers/helper";

export default async function TenantsPage() {
  const tenants = await prisma.tenant.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });

  // Serialize the entire array to handle any Date issues
  const serializedTenants = serializeData(tenants);

  return (
    <SectionPage
      title="Tenants"
      description="Manage tenant profiles, leases, contacts, and balances."
      tenants={serializedTenants}
    />
  );
}
