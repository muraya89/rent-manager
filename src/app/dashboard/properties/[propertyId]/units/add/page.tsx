import { prisma } from "@/lib/prisma";
import AddUnitForm from "./unitForm";

export default async function AddUnitPage({
  params,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { propertyId } = await params;
  const property_id = Number(propertyId);

  if (Number.isNaN(property_id)) {
    return <div>Invalid property ID</div>;
  }

  const property = await prisma.property.findUnique({
    where: {
      id: property_id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <>
      <AddUnitForm propertyId={property.id} propertyName={property.name} />
    </>
  );
}
