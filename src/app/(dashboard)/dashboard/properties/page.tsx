import SectionPage from "./components/section-page";
import { prisma } from "@/lib/prisma";

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      units: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <SectionPage
      title="Properties"
      properties={properties}
      description="Add buildings and units, set monthly rent, and monitor occupancy."
    />
  );
}
