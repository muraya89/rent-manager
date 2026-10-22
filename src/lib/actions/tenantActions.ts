"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { serializeData } from "@/lib/helpers/helper";

export async function createTenant(values: {
  name: string;
  email: string;
  phone: string;
}) {
  try {
    await prisma.tenant.create({
      data: {
        name: values.name,
        email: values.email,
        phone: values.phone,
      },
    });
  } catch (error) {
    console.error("Failed to create tenant:", error);
    throw error;
  }

  redirect(
    `/dashboard/tenants?success=Tenant%20${encodeURIComponent(
      values.name,
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