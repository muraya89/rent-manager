"use client";

import Link from "next/link";
import {
  Card,
  CardTitle,
  CardBody,
  Button,
  Table,
} from "reactstrap";
import CustomBadge from "@/app/shared-components/custom-badge";
import Alert from "@/app/shared-components/alert";

interface Unit {
  id: number;
  unitNumber: string;
  monthlyRent: number;
  propertyId: number;
  leases: Array<{
    id: number;
    tenant: {
      name: string;
    };
  }>;
}

interface Property {
  id: number;
  name: string;
  address: string;
  monthlyRent: number;
}

interface PropertyDetailClientProps {
  property: Property;
  units: Unit[];
  unitAlert?: string;
  tenantAlert?: string;
}

export default function PropertyDetailClient({
  property,
  units,
  unitAlert,
  tenantAlert,
}: PropertyDetailClientProps) {
  return (
    <>
      {/* Property Information Card */}
      <Card className="border-0 mb-4">
        <div className="bg-secondary px-4 py-5 sm:px-10 sm:py-12 rounded-t-lg">
          <h3 className="tracking-tight sm:text-4xl">{property.name}</h3>
          <p className="text-muted mt-2">{property.address}</p>
        </div>
        <CardBody className="px-4">
          <CardTitle className="text-2xl">Property Details</CardTitle>
          <hr />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-muted text-sm">Total Units</p>
              <p className="text-2xl font-semibold">{units.length}</p>
            </div>
            <div>
              <p className="text-muted text-sm">Occupied Units</p>
              <p className="text-2xl font-semibold">
                {units.filter((u) => u.leases.length > 0).length}
              </p>
            </div>
            <div>
              <p className="text-muted text-sm">Vacant Units</p>
              <p className="text-2xl font-semibold">
                {units.filter((u) => u.leases.length === 0).length}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Units Table Card */}
      <Card className="border-0">
        <CardBody className="px-4">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-2xl mb-0">Units</CardTitle>
            <Link href={`/dashboard/properties/${property.id}/units/add`}>
              <Button color="primary" className="rounded-xl px-4 py-2">
                Add Unit
              </Button>
            </Link>
          </div>

          {unitAlert && <Alert message={unitAlert} />}

          {tenantAlert && <Alert message={tenantAlert} />}
          <hr />
          <Table responsive>
            <thead>
              <tr>
                <th>Unit Number</th>
                <th>Monthly Rent</th>
                <th>Tenant</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.length > 0 ? (
                units.map((unit) => (
                  <tr key={unit.id}>
                    <td>{unit.unitNumber}</td>
                    <td>KES {unit.monthlyRent.toLocaleString()}</td>
                    <td>
                      {unit.leases.length > 0
                        ? unit.leases[0].tenant.name
                        : "Vacant"}
                    </td>
                    <td>
                      {unit.leases.length > 0 ? (
                        <CustomBadge text="Occupied" baseColor="green" />
                      ) : (
                        <CustomBadge text="Vacant" baseColor="red" />
                      )}
                    </td>
                    <td>
                      <Link
                        href={`/dashboard/properties/${property.id}/units/${unit.id}`}
                        className="text-primary"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    No units found for this property.{" "}
                    <Link
                      href={`/dashboard/properties/${property.id}/units/add`}
                      className="text-primary"
                    >
                      Add your first unit
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}