import { prisma } from "@/lib/prisma";
import DashboardContent from "./dashboard-content";
import type { TenantActivity } from "@/app/Types/dashboard";
import {formatMoney as money} from "@/lib/helpers/helper";

export default async function DashboardPage() {
  const currentDate = new Date();
  const monthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const nextMonthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1,
  );

  const [
    tenants,
    propertyCount,
    unitCount,
    occupiedUnitCount,
    expectedRent,
    outstandingRent,
    collectedRent,
  ] = await Promise.all([
    prisma.tenant.findMany({
      select: {
        name: true,
        id: true,
        leases: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            status: true,
            monthlyRent: true,
            unit: {
              select: {
                unitNumber: true,
                property: { select: { name: true } },
              },
            },
            rentCharges: {
              orderBy: { dueDate: "desc" },
              take: 1,
              select: { amount: true, status: true },
            },
          },
        },
      },
    }),
    prisma.property.count(),
    prisma.unit.count(),
    // count of units that are currently occupied (i.e., have an active lease)
    prisma.lease.count({ where: { status: "ACTIVE" } }),
    // expected rent for the current month
    prisma.rentCharge.aggregate({
      _sum: { amount: true },
      where: { dueDate: { gte: monthStart, lt: nextMonthStart } },
    }),
    // current-month rent charges, with payments used to calculate outstanding rent
    prisma.rentCharge.findMany({
      where: {
        dueDate: { gte: monthStart, lt: nextMonthStart },
      },
      include: {
        payments: {
          select: {
            amount: true,
          },
        },
      },
    }),
    // collected rent for the current month
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { paidAt: { gte: monthStart, lt: nextMonthStart } },
    }),
  ]);

  const tenantRows: TenantActivity[] = tenants.map((tenant) => {
    const lease = tenant.leases[0];
    const charge = lease?.rentCharges[0];
    const nameParts = tenant.name.trim().split(/\s+/);

    return {
      name: tenant.name,
      unit: lease?.unit.unitNumber ?? "No unit assigned",
      property: lease?.unit.property.name ?? "No property assigned",
      amount: charge?.amount.toString() ?? lease?.monthlyRent.toString() ?? "0",
      status: charge?.status ?? lease?.status ?? "No lease",
      initials: nameParts
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      color: "bg-sky-100 text-sky-700",
    };
  });

  const occupancyRate =
    unitCount === 0 ? 0 : (occupiedUnitCount / unitCount) * 100;
  const expectedRentAmount = Number(expectedRent._sum.amount ?? 0);
  const collectedRentAmount = Number(collectedRent._sum.amount ?? 0);
  const outstandingRentAmount = outstandingRent.reduce((total, charge) => {
    const paidAmount = charge.payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    return total + Math.max(0, Number(charge.amount) - paidAmount);
  }, 0);

  const stats = [
    {
      label: "Total properties",
      value: propertyCount.toString(),
      detail: `${unitCount} total units`,
      accent: "bg-violet-500",
      icon: "building" as const,
    },
    {
      label: "Occupancy rate",
      value: `${occupancyRate.toFixed(1)}%`,
      detail: `${occupiedUnitCount} of ${unitCount} units occupied`,
      accent: "bg-emerald-500",
      icon: "people" as const,
    },
    {
      label: "Expected this month",
      value: money(expectedRentAmount),
      detail: `${money(collectedRentAmount)} collected`,
      accent: "bg-sky-500",
      icon: "receipt" as const,
    },
    {
      label: "Outstanding rent",
      value: money(outstandingRentAmount),
      detail: "Across unpaid and overdue charges",
      accent: "bg-amber-500",
      icon: "chart" as const,
    },
  ];

  return (
    <DashboardContent
      tenants={tenantRows}
      stats={stats}
      collection={{
        collected: collectedRentAmount,
        expected: expectedRentAmount,
      }}
    />
  );
}
