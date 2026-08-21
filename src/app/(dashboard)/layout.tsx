"use client";
import { Sidebar } from "@/app/(dashboard)/dashboard/sidebar";
import { useMemo, useState } from "react";
import { DashboardHeader } from "./dashboard/header";
import { InsightsPanel } from "./dashboard/reports/components/insights";
import { Alert, Button } from "reactstrap";
import { StatsGrid } from "./dashboard/reports/components/stats";
import { ActivityTable } from "./dashboard/activity-table";
import { tenants } from "../data/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState(false);
  const filteredTenants = useMemo(
    () =>
      tenants.filter((tenant) =>
        `${tenant.name} ${tenant.unit} ${tenant.property}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );
  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#18212f]">
      <div className="flex min-h-screen w-full">
        <Sidebar
          isMobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <section className="min-w-0 flex-1 px-4 py-4 sm:px-8 lg:px-10 lg:py-7">
          {children}
        </section>
      </div>
    </main>
  );
}
