import { prisma } from "@/lib/prisma";

export async function viewUnit(unitID: number) {
  const unit = await prisma.unit.findUnique({
    where: { id: unitID },
    include: {
      property: true,
      leases: {
        include: {
          tenant: true,
          rentCharges: {
            include: {
              payments: true,
            },
          },
        },
        orderBy: {
          startDate: "desc",
        },
      },
    },
  });

  if (!unit) {
    return null;
  }
  return {
    ...unit,
    monthlyRent: Number(unit.monthlyRent),
    isOccupied: unit.leases.some((lease) => lease.status === "ACTIVE"),

    property: {
      ...unit.property,
      monthlyRent: Number(unit.property.monthlyRent),
    },

    leases: unit.leases.map((lease) => ({
      ...lease,
      monthlyRent: Number(lease.monthlyRent),
      startDate: lease.startDate.toISOString(),
      endDate: lease.endDate?.toISOString() ?? null,

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
