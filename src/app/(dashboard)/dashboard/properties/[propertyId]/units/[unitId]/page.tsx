import { viewUnit } from "@/lib/queries/unitQueries";
import { getNotLeasedTenant } from "@/lib/queries/tenantQueries";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import UnitView from "../components/unitView";
interface UnitDetailsPageProps {
  params: Promise<{
    propertyId: string;
    unitId: string;
  }>;
}

export default async function UnitDetailsPage({
  params,
}: UnitDetailsPageProps) {
  const { propertyId, unitId } = await params;

  const propertyIdNumber = Number(propertyId);
  const unitIdNumber = Number(unitId);

  // fetch unit...
    const unitDetails = await viewUnit(unitIdNumber);
  const tenants = await getNotLeasedTenant();

  return (
    <div className="px-4">
      <Breadcrumb className="px-4">
        <BreadcrumbItem>
          <Link href="/dashboard/properties" className="no-underline">
            Properties
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link
            href={`/dashboard/properties/${propertyIdNumber}`}
            className="no-underline"
          >
            Units
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>{unitDetails?.unitNumber}</BreadcrumbItem>
      </Breadcrumb>

      <hr />

      <UnitView unit={unitDetails} tenants={tenants} />
    </div>
  );
}
