import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import PropertyDetailClient from "./components/property-detail-client";

export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const propertyId = Number(id);

  if (Number.isNaN(propertyId)) {
    return <div>Invalid property ID</div>;
  }

  let property;
  let units;

  try {
    property = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
      select: {
        id: true,
        name: true,
        address: true,
        monthlyRent: true,
      },
    });

    if (!property) {
      return <div>Property not found</div>;
    }

    units = await prisma.unit.findMany({
      where: {
        propertyId,
      },
      select: {
        id: true,
        unitNumber: true,
        monthlyRent: true,
        propertyId: true,
        leases: {
          where: { status: "ACTIVE" },
          select: {
            id: true,
            tenant: { select: { name: true } },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in PropertyDetail:", error);
    return (
      <div>
        Error loading property:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  // Convert Decimal to number for display
  const formattedUnits = units.map((unit) => ({
    ...unit,
    monthlyRent: Number(unit.monthlyRent),
  }));

  const formattedProperty = {
    ...property,
    monthlyRent: Number(property.monthlyRent),
  };

  return (
    <>
      <div className="px-4">
        <Breadcrumb className="px-4">
          <BreadcrumbItem>
            <Link href="/dashboard/properties" className="no-underline">
              Properties
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>{property.name}</BreadcrumbItem>
        </Breadcrumb>

        <hr />

        <PropertyDetailClient property={formattedProperty} units={formattedUnits} />
      </div>
    </>
  );
}
