"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { serializeData } from "@/lib/helpers/helper";
import { addLease } from "@/lib/actions/leaseActions";

export async function createTenant(values: {
  isOccupied: boolean;
  tenant: {
    name: string;
    phone: string;
    email: string;
  };
  lease: {
    monthlyRent: number;
    depositAmount: number;
    startDate: string;
    endDate: string;
    occupants: number;
    rentDueDay: number;
  };
}) {
  try {
    const result = await prisma.tenant.create({
      data: {
        name: values.tenant.name,
        email: values.tenant.email,
        phone: values.tenant.phone,
      },
    });

    if (values.isOccupied) addLease({ tenantId: result.id, ...values });
  } catch (error) {
    console.error("Failed to create tenant:", error);
    throw error;
  }

  redirect(
    `/dashboard/tenants?success=Tenant%20${encodeURIComponent(
      values.tenant.name,
    )}%20added%20successfully`,
  );
}

export async function viewTenant(values: number) {
  await prisma.tenant.findUnique({
    where: { id: values },
    include: {
      property: true,
      leases: {
        include: {
          tenant: true,
        },
        orderBy: {
          startDate: "desc",
        },
      },
    },
  });
}

export async function updateTenant(data: {
  id: number;
  name: string;
  email: string;
  phone: string;
}) {
  const tenant = await prisma.tenant.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
    },
  });

  return serializeData(tenant);
}
