"use server"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation";


export async function createTenant(
    values: {
        name: string,
        email: string,
        phone: string,
    }
) {
    try {
        await prisma.tenant.create({
          data: {
            ...values,
          },
        });
        redirect(
          `/dashboard/tenants?success=Tenant%20${encodeURIComponent(
            values.name,
          )}%20added%20successfully`,
        );
    } catch (error) {
        console.error("Failed to create tenant:", error);
        throw error;

    }
    
}