"use server"
import { prisma } from "@/lib/prisma";

export async function getProperties() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        address: true,
        monthlyRent: true,
      },
    });

    return properties.map((p) => ({
      ...p,
      monthlyRent: p.monthlyRent.toNumber(),
    }));
  } catch (error) {
    console.error("Failed to fetch properties", { error });
    throw new Error("Unable to load properties");
  }
}
