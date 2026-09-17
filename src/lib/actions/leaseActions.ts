  "use server";

  import { prisma } from "@/lib/prisma";

  export async function addLease(values) {
    console.log('to server values', values)
    try {
      const lease = await prisma.lease.create({
        data: {
          tenantId: Number(values.tenantId),
          unitId: Number(values.unitId),
          startDate: new Date(values.startDate),
          endDate: values.endDate ? new Date(values.endDate) : null,
          monthlyRent: values.monthlyRent,
          status: "ACTIVE",
        },
      });
      return {
        success: true,
        message: "Lease ended successfully.",
        data: { ...lease,
    monthlyRent: Number(lease.monthlyRent)},
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
