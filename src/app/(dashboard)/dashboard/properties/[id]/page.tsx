import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";

export default async function PropertyUnits({
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
      },
    });
  } catch (error) {
    console.error("Error in PropertyUnits:", error);

    return (
      <div>
        Error loading property:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/dashboard/properties" className="no-underline">
            Properties
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>Units</BreadcrumbItem>
      </Breadcrumb>

      <div>Property: {property.name}</div>

      <div>Units: {units.length}</div>
    </>
  );
}
