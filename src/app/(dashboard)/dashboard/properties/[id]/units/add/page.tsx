import { prisma } from "@/lib/prisma";
import AddUnitForm from "./unitForm";
import  Alert  from "@/app/shared-components/alert";

export default async function AddUnitPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const propertyId = Number(id);
  const { success } = await searchParams;

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

  return (
    <>
      <AddUnitForm propertyId={property.id} propertyName={property.name} />
    </>
  );
}
