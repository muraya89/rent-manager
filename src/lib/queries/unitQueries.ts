"use server";
import { prisma } from "@/lib/prisma";

export async function getPropertyUnits(propertyId: number) {
  if (!propertyId) {
    throw new Error("getPropertyUnits: propertyId is required");
  }

  try {
    const units = await prisma.unit.findMany({
      where: { propertyId },
      orderBy: { unitNumber: "asc" },
      select: {
        id: true,
        unitNumber: true,
        monthlyRent: true,
        propertyId: true,
        defaultDeposit: true,
        leases: {
          where: { status: "ACTIVE" },
          take: 1, // a unit should only have one active lease
          select: {
            id: true,
            tenant: { select: { id: true, name: true } },
          },
        },
      },
    });

    return units.map((u) => ({
      ...u,
      monthlyRent: u.monthlyRent.toNumber(),
      defaultDeposit: u.defaultDeposit?.toNumber(),
    }));
  } catch (error) {
    console.error("Failed to fetch units", { propertyId, error });
    throw new Error("Unable to load units for this property");
  }
}

export async function viewUnit(unitID: number) {
  const unit = await prisma.unit.findUnique({
    where: { id: unitID },
    include: {
      property: true,
      leases: {
        include: {
          tenant: true,
          rentCharges: { include: { payments: true } },
        },
        orderBy: { startDate: "desc" },
      },
    },
  });

  if (!unit) return null;

  return {
    ...unit,
    monthlyRent: Number(unit.monthlyRent),
    defaultDeposit: Number(unit.defaultDeposit), // if it's a Decimal
    isOccupied: unit.leases.some((lease) => lease.status === "ACTIVE"),
    createdAt: unit.createdAt.toISOString(),
    updatedAt: unit.updatedAt.toISOString(),

    property: {
      ...unit.property,
      monthlyRent: Number(unit.property.monthlyRent),
      createdAt: unit.property.createdAt.toISOString(),
      updatedAt: unit.property.updatedAt.toISOString(),
    },

    leases: unit.leases.map((lease) => ({
      ...lease,
      monthlyRent: Number(lease.monthlyRent),
      startDate: lease.startDate.toISOString(),
      endDate: lease.endDate?.toISOString() ?? null,
      createdAt: lease.createdAt.toISOString(),
      updatedAt: lease.updatedAt.toISOString(),

      tenant: {
        ...lease.tenant,
        createdAt: lease.tenant.createdAt.toISOString(),
        updatedAt: lease.tenant.updatedAt.toISOString(),
      },

      rentCharges: lease.rentCharges.map((charge) => ({
        ...charge,
        amount: Number(charge.amount),
        dueDate: charge.dueDate.toISOString(),
        createdAt: charge.createdAt.toISOString(),
        updatedAt: charge.updatedAt.toISOString(),

        payments: charge.payments.map((payment) => ({
          ...payment,
          amount: Number(payment.amount),
          paidAt: payment.paidAt.toISOString(),
          createdAt: payment.createdAt.toISOString(),
          updatedAt: payment.updatedAt.toISOString(),
        })),
      })),
    })),
  };
}
