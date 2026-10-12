import { notFound } from "next/navigation";
import {getTenant } from "@/lib/queries/tenantQueries"
import { serializeData } from "@/lib/helpers/helper";
import TenantView from "./components/tenantView";

interface TenantPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { tenantId } = await params;
  const tenant = await getTenant(tenantId);

  if (!tenant) {
    notFound();
  }

  const serializedTenant = serializeData(tenant);

  return <TenantView tenant={serializedTenant} />;
}
