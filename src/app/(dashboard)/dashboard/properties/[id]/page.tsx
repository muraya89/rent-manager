import { prisma } from "@/lib/prisma";

export default async function PropertyUnits({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  console.log("PropertyUnits START");

  const { id } = await params;

  console.log("ID:", id);

  const property = await prisma.property.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      units: true,
    },
  });

  console.log("AFTER PRISMA");

  if (!property) {
    return <div>Property not found</div>;
  }

  console.log("PROPERTY ID:", property.id);
  console.log("PROPERTY NAME:", property.name);
  console.log("UNIT COUNT:", property.units.length);

  return <div>Property loaded successfully</div>;
}
  