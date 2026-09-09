import SectionPage from "./components/section-page";
import { prisma } from "@/lib/prisma";
import { serializeData } from "@/lib/helpers/helper";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      monthlyRent: true,
      // Exclude date fields to avoid MariaDbAdapter issues
      units: {
        select: {
          id: true,
          unitNumber: true,
          monthlyRent: true,
          // Exclude date fields to avoid MariaDbAdapter issues
          leases: {
            where: { status: "ACTIVE" },
            select: {
              tenant: { select: { name: true } },
              // Exclude date fields to avoid MariaDbAdapter issues
            },
          },
        },
      },
    },
  });

  const propertyData = properties.map((property) => ({
    ...property,
    monthlyRent: Number(property.monthlyRent),
    units: property.units.map((unit) => ({
      ...unit,
      monthlyRent: Number(unit.monthlyRent),
    })),
  }));

  // Serialize the entire array to handle any Date issues
  const serializedProperties = serializeData(propertyData);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem active>Properties</BreadcrumbItem>
      </Breadcrumb>
      <SectionPage
        title="Properties"
        properties={serializedProperties}
        description="Add buildings and units, set monthly rent, and monitor occupancy."
      />
    </>
  );
}
