"use server";

import { UnitFormValues } from "@/app/Types/unit";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createUnit(propertyId: number, values: UnitFormValues) {
  try {
    await prisma.$transaction(async (tx) => {
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
        return;
      }

      // 3. Create the tenant
      const tenant = await tx.tenant.create({
        data: {
          name: values.name,
          email: values.email,
          phone: values.phone,
        },
      });

      // 4. Create the lease connecting the tenant and unit
      const lease = await tx.lease.create({
        data: {
          unitId: unit.id,
          tenantId: tenant.id,
          startDate: new Date(),
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
          dueDate: new Date(),
          period: "September 2026",
          status: "UNPAID",
        },
      });
    });
  } catch (error) {
    console.error("Failed to create unit:", error);
    throw error;
  }

  // 5. Redirect after the transaction succeeds
  if (values.isOccupied) {
    redirect(
      `/dashboard/properties/${propertyId}?unitSuccess=${encodeURIComponent(
        `Unit ${values.unitNumber} added successfully`,
      )}&tenantSuccess=${encodeURIComponent(
        `Tenant ${values.name} added successfully`,
      )}`,
    );
  }

  redirect(
    `/dashboard/properties/${propertyId}?unitSuccess=${encodeURIComponent(
      `Unit ${values.unitNumber} added successfully`,
    )}`,
  );
}

