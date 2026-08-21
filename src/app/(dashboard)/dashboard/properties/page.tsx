import SectionPage from "./components/section-page";
import { prisma } from "@/lib/prisma";

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      monthlyRent: true,
      units: {
        select: {
          id: true,
          unitNumber: true,
          monthlyRent: true,
          leases: {
            where: { status: "ACTIVE" },
            select: {
              tenant: { select: { name: true } },
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

  return (
    <SectionPage
      title="Properties"
      properties={propertyData}
      description="Add buildings and units, set monthly rent, and monitor occupancy."
    />
  );
}
