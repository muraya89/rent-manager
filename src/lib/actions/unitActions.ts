"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createUnit(
  propertyId: number,
  values: {
    unitNumber: string;
    monthlyRent: number;
  },
) {
  await prisma.unit.create({
    data: {
      propertyId,
      unitNumber: values.unitNumber,
      monthlyRent: values.monthlyRent,
    },
  });

  redirect(
    `/dashboard/properties/${propertyId}?success=Unit%20${encodeURIComponent(
      values.unitNumber,
    )}%20added%20successfully`,
  );
}
