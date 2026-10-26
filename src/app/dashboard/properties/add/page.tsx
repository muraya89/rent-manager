import AddPropertyForm from "../components/addPropertyForm";
import { Breadcrumb, BreadcrumbItem, Card, Button } from "reactstrap";
import Link from "next/link";
import { useRouter } from "next/router";

export default function addTenantPage() {
  const router = useRouter();
  return (
    <>
      <div>
        <Breadcrumb className="px-4">
          <BreadcrumbItem>
            <Link href="/dashboard/properties" className="no-underline">
              Properties
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Add Tenant</BreadcrumbItem>
        </Breadcrumb>

        <hr />

        <Card>
          <div className="bg-secondary px-4 py-5 sm:px-10 sm:py-12 rounded-lg">
            <h3 className="tracking-tight sm:text-4xl text-white">
              Add Property
            </h3>
          </div>
        </Card>

        <AddPropertyForm />
      </div>
    </>
  );
}
