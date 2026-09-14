import AddTenantForm from "../components/addTenantForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
} from "reactstrap";
import Link from "next/link";

export default function addTenantPage() {
  return (
    <>
      <div>
        <Breadcrumb className="px-4">
          <BreadcrumbItem>
            <Link href="/dashboard/properties" className="no-underline">
              Tenants
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Add Tenant</BreadcrumbItem>
        </Breadcrumb>

        <hr />

        <Card>
          <div className="bg-secondary px-4 py-5 sm:px-10 sm:py-12 rounded-t-lg">
            <h3 className="tracking-tight sm:text-4xl">Add Tenant</h3>
          </div>
          <AddTenantForm />
        </Card>
      </div>
    </>
  );
}
