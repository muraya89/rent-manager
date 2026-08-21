import SectionPage from "./components/section-page";
import { prisma } from "@/lib/prisma";

export default async function TenantsPage() {
  const tenants = await prisma.tenant.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });
  return (
    <SectionPage
      title="Tenants"
      description="Manage tenant profiles, leases, contacts, and balances."
      tenants={tenants}
    />
  );
}
