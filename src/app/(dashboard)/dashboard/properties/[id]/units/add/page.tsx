import { prisma } from "@/lib/prisma";
import AddUnitForm from "./unitForm";

export default async function AddUnitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const propertyId = Number(id);

  if (Number.isNaN(propertyId)) {
    return <div>Invalid property ID</div>;
  }

  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!property) {
    return <div>Property not found</div>;
  }

  return <AddUnitForm propertyId={property.id} propertyName={property.name} />;
}
