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

export async function getLeasedTenant() {
  try {
    const activeTenants = await prisma.tenant.count({
      where: {
        leases: {
          some: {
            status: "ACTIVE",
          },
        },
      },
    });
    return activeTenants;
  } catch (error) {
     console.error("Failed to fetch tenants:", error);

     return {
       success: false,
       message:
         error instanceof Error ? error.message : "Failed to fetch tenants.",
     };
  }
}

export async function NewTenant() {
  try {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newTenants = await prisma.tenant.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });
    return newTenants;
  } catch (error) {
     console.error("Failed to fetch tenants:", error);

     return {
       success: false,
       message:
         error instanceof Error ? error.message : "Failed to fetch tenants.",
     };
  }
}

export async function expiringSoonTenants() {
  try {
    const now = new Date();

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const leasesExpiringSoon = await prisma.lease.count({
      where: {
        status: "ACTIVE",

        endDate: {
          gte: now,
          lte: thirtyDaysFromNow,
        },
      },
    });
    return leasesExpiringSoon;
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

export async function getTenant(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: Number(tenantId),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,

      leases: {
        orderBy: {
          startDate: "desc",
        },
        select: {
          id: true,
          startDate: true,
          endDate: true,
          monthlyRent: true,
          status: true,

          unit: {
            select: {
              id: true,
              unitNumber: true,

              property: {
                select: {
                  id: true,
                  name: true,
                  address: true,
                },
              },
            },
          },

          rentCharges: {
            orderBy: {
              dueDate: "desc",
            },
            select: {
              id: true,
              amount: true,
              dueDate: true,
              status: true,

              payments: {
                select: {
                  id: true,
                  amount: true,
                  paidAt: true,
                  method: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return tenant;
}