"use server"

import { prisma } from "@/lib/prisma";
import { serializeData } from "@/lib/helpers/helper";

export async function createUnit(data: {
  propertyId: number;
  unitNumber: string;
  monthlyRent: number;
}) {
  try {
    const unit = await prisma.unit.create({
      data: {
        property: {
          connect: {
            id: data.propertyId,
          },
        },
        unitNumber: data.unitNumber,
        monthlyRent: data.monthlyRent,
      },
    });

    return {
      success: true,
      unit: serializeData(unit),
    };
  } catch (error) {
    console.error("Failed to create unit:", error);

    return {
      success: false,
      error: "Failed to create unit",
    };
  }
}
