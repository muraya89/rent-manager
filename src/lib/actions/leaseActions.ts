"use server";

import { prisma } from "@/lib/prisma";

export async function addLease(values: any) {
  try {
    const lease = await prisma.lease.create({
      data: {
        tenantId: Number(values.tenantId),
        unitId: Number(values.unitId),
        startDate: new Date(values.lease.startDate),
        endDate: values.lease.endDate ? new Date(values.lease.endDate) : null,
        monthlyRent: values.lease.monthlyRent,
        depositAmount: values.lease.depositAmount || 0,
        rentDueDay: Number(values.lease.rentDueDay) || 1,
        occupants: values.lease.occupants || 1,
        status: "ACTIVE",
      },
    });

    if (
      values.lease.depositReceived &&
      Number(values.lease.depositAmount) > 0
    ) {
      await prisma.depositTransaction.create({
        data: {
          leaseId: lease.id,
          type: "RECEIVED",
          amount: values.lease.depositAmount,
          occurredAt: new Date(values.lease.startDate),
        },
      });
    }
    return {
      success: true,
      message: "Lease ended successfully.",
      data: { ...lease, monthlyRent: Number(lease.monthlyRent) },
    };
  } catch (error) {
    console.error("Failed to end lease:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to end lease.",
    };
  }
}
export async function endLease(
  leaseId: number,
  endDate: Date,
  terminationReason: string,
) {
  try {
    const lease = await prisma.lease.findUnique({
      where: {
        id: leaseId,
      },
    });

    if (!lease) {
      throw new Error("Lease not found.");
    }

    if (lease.status !== "ACTIVE") {
      throw new Error("This lease is already ended.");
    }

    await prisma.lease.update({
      where: {
        id: leaseId,
      },
      data: {
        endDate,
        status: "TERMINATED",
        terminationReason,
      },
    });

    return {
      success: true,
      data: { ...lease, monthlyRent: Number(lease.monthlyRent) },
      message: "Lease ended successfully.",
    };
  } catch (error) {
    console.error("Failed to end lease:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to end lease.",
    };
  }
}

// export async function getDepositHeld(leaseId: number) {
//   const rows = await prisma.depositTransaction.groupBy({
//     by: ["type"],
//     where: { leaseId },
//     _sum: { amount: true },
//   });

//   const sum = (t: string) =>
//     new Prisma.Decimal(rows.find((r) => r.type === t)?._sum.amount ?? 0);

//   return sum("RECEIVED").minus(sum("DEDUCTION")).minus(sum("REFUND"));
// }
