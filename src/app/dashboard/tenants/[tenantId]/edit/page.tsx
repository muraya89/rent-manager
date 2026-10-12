import { notFound } from "next/navigation";
import {getTenant} from "@/lib/queries/tenantQueries"
import { serializeData } from "@/lib/helpers/helper";
import EditTenantForm from "./components/editTenantForm";

interface EditTenantPageProps {
  params: Promise<{
    tenantId: string;
  }>;
}

export default async function EditTenantPage({ params }: EditTenantPageProps) {
  const { tenantId } = await params;

  const tenant = await getTenant(tenantId);

  if (!tenant) {
    notFound();
  }

  return <EditTenantForm tenant={serializeData(tenant)} />;
}
