import type { IconName, TenantActivity } from "@/app/Types/dashboard";

export const tenants: TenantActivity[] = [
  {
    name: "Amina Wanjiku",
    unit: "Apt 2B",
    property: "Maple Heights",
    amount: "KES 28,000",
    status: "Paid",
    initials: "AW",
    color: "bg-violet-100 text-violet-700",
  },
  {
    name: "Brian Otieno",
    unit: "Apt 4A",
    property: "Maple Heights",
    amount: "KES 32,000",
    status: "Due today",
    initials: "BO",
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "Caroline Njeri",
    unit: "Studio 8",
    property: "Garden View",
    amount: "KES 22,500",
    status: "Overdue",
    initials: "CN",
    color: "bg-rose-100 text-rose-700",
  },
  {
    name: "David Kamau",
    unit: "Apt 1C",
    property: "Maple Heights",
    amount: "KES 28,000",
    status: "Paid",
    initials: "DK",
    color: "bg-sky-100 text-sky-700",
  },
  {
    name: "Emily Chebet",
    unit: "Apt 3A",
    property: "Riverside Court",
    amount: "KES 35,000",
    status: "Pending",
    initials: "EC",
    color: "bg-emerald-100 text-emerald-700",
  },
];

export const navigation: { label: string; icon: IconName; href: string }[] = [
  { label: "Overview", icon: "grid", href: "/" },
  { label: "Properties", icon: "building", href: "/properties" },
  { label: "Tenants", icon: "people", href: "/tenants" },
  { label: "Payments", icon: "receipt", href: "/payments" },
  { label: "Reports", icon: "chart", href: "/reports" },
];
