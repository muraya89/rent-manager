"use server";
import { prisma } from "@/lib/prisma";

export async function getTenants() {
  try {
    const tenants = await prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });
    return tenants;
  } catch (error) {
    console.error("Failed to end lease:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to end lease.",
    };
  }
}

export async function getNotLeasedTenant() {
  try {
    const tenants = await prisma.tenant.findMany({
      where: {
        leases: {
          none: {
            status: "ACTIVE",
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });
    return tenants;
  } catch (error) {
     console.error("Failed to end lease:", error);

     return {
       success: false,
       message: error instanceof Error ? error.message : "Failed to end lease.",
     };
  }
}
