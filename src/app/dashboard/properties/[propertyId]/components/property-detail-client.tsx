"use client";

import Link from "next/link";
import { Card, CardTitle, CardBody, Button, Table } from "reactstrap";
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
        <div className="bg-secondary px-4 py-5 sm:px-10 sm:py-12 rounded-lg flex justify-between">
          <div className="flex flex-col">
            <span className="tracking-tight text-[34px] sm:text-4xl text-white font-bold">
              {property.name}
            </span>
            <span className="mt-2 text-[#ebcbda]">{property.address}</span>
          </div>
          <div className="flex gap-4 text-white">
            <div className="flex flex-col">
              <span className="fw-bolder text-[30px]">{units.length}</span>
              <span className="text-[13px] text-[#ebcbda]">Total units</span>
            </div>
            <div className="flex flex-col">
              <span className="fw-bolder text-[30px]">
                {units.filter((u) => u.leases.length > 0).length}
              </span>
              <span className="text-[13px] text-[#ebcbda]">Occupied</span>
            </div>
            <div className="flex flex-col">
              <span className="fw-bolder text-[30px]">
                {units.filter((u) => u.leases.length === 0).length}
              </span>
              <span className="text-[13px] text-[#ebcbda]">Vacant</span>
            </div>
          </div>
        </div>
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
              <tr className="text-uppercase text-[12px]">
                <th>Unit</th>
                <th>Monthly Rent</th>
                <th>Tenant</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {units.length > 0 ? (
                units.map((unit) => (
                  <tr key={unit.id}>
                    <td className="font-bold">{unit.unitNumber}</td>
                    <td>KES {unit.monthlyRent.toLocaleString()}</td>
                    <td className={`${unit.leases.length > 0?"":"text-muted"}`}>
                      {unit.leases.length > 0
                        ? unit.leases[0].tenant.name
                        : "No tenant"}
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
