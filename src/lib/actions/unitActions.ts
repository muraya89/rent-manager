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
    console.log('data',{
      propertyId,
      unitNumber: values.unitNumber,
      monthlyRent: values.monthlyRent,
    });
  await prisma.unit.create({
    data: {
      propertyId,
      unitNumber: values.unitNumber,
      monthlyRent: values.monthlyRent,
    },
  });

  redirect(`/dashboard/properties/${propertyId}`);
}
