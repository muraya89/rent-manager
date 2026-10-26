"use server";

import { UnitFormValues } from "@/app/Types/unit";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createUnit(propertyId: number, values: UnitFormValues) {
  let result: { unitId: number; tenantName: string | null };
  try {
    result = await prisma.$transaction(async (tx) => {
      // 1. Create the unit
      const unit = await tx.unit.create({
        data: {
          propertyId,
          unitNumber: values.unitNumber,
          monthlyRent: values.monthlyRent,
        },
      });

      // 2. If the unit is vacant, we're done
      if (!values.isOccupied) {
         return { unitId: unit.id, tenantName: null };
      }

      // 3. Create the tenant
      let tenantId: number;
      let tenantName: string;

      if (values.tenantMode === "existing") {
        const existing = await tx.tenant.findUniqueOrThrow({
          where: { id: Number(values.tenantId) },
          select: { id: true, name: true },
        });
        tenantId = existing.id;
        tenantName = existing.name;
      } else {
        const tenant = await tx.tenant.create({
          data: {
            name: values.tenant.name,
            email: values.tenant.email,
            phone: values.tenant.phone,
          },
        });
        tenantId = tenant.id;
        tenantName = tenant.name;
      }

      // 4. Create the lease connecting the tenant and unit
      const startDate = new Date(values.lease.startDate);
      const lease = await tx.lease.create({
        data: {
          unitId: unit.id,
          tenantId,
          startDate,
          endDate: values.lease.endDate ? new Date(values.lease.endDate) : null,
          monthlyRent: values.monthlyRent,
          status: "ACTIVE",
        },
      });

      // 5. Create the rent charges
      {
        /** TO DO : What about a tenant moving in halfway through a month. You need to decide whether your system supports prorated rent. */
      }
      await tx.rentCharge.create({
        data: {
          leaseId: lease.id,
          amount: values.monthlyRent,
          dueDate: startDate,
          period: startDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          }),

          status: "UNPAID",
        },
      });

      return { unitId: unit.id, tenantName };
    });
  } catch (error) {
    console.error("Failed to create unit:", error);
    throw error;
  }

  // 5. Redirect after the transaction succeeds
  const params = new URLSearchParams({
    unitSuccess: `Unit ${values.unitNumber} added successfully`,
  });
  if (result.tenantName) {
    params.set(
      "tenantSuccess",
      `Tenant ${result.tenantName} added successfully`,
    );
  }

  redirect(`/dashboard/properties/${propertyId}?${params.toString()}`);
  // if (values.isOccupied) {
  //   redirect(
  //     `/dashboard/properties/${propertyId}?unitSuccess=${encodeURIComponent(
  //       `Unit ${values.unitNumber} added successfully`,
  //     )}&tenantSuccess=${encodeURIComponent(
  //       `Tenant ${values.tenant.name} added successfully`,
  //     )}`,
  //   );
  // }

  // redirect(
  //   `/dashboard/properties/${propertyId}?unitSuccess=${encodeURIComponent(
  //     `Unit ${values.unitNumber} added successfully`,
  //   )}`,
  // );
}
