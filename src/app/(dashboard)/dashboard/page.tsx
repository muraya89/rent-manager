"use client";

import { useMemo, useState } from "react";
import { tenants } from "@/app/data/dashboard";
import { Alert, Button, Container } from "reactstrap";
import { ActivityTable } from "./activity-table";
import { DashboardHeader } from "./header";
import { InsightsPanel } from "./reports/components/insights";
import { Sidebar } from "./sidebar";
import { StatsGrid } from "./reports/components/stats";

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <Container
      fluid
      className="mx-auto flex min-h-screen w-full max-w-none px-0"
    >
      <section className="min-w-0 flex-1 px-4 py-4 sm:px-8 lg:px-10 lg:py-7">
        <DashboardHeader
          query={query}
          onQueryChange={setQuery}
          onAddTenant={() => setNotice(true)}
          onOpenMenu={() => setMobileMenuOpen(true)}
        />
        {notice && (
          <Alert
            color="primary"
            className="mb-5 flex items-center justify-between rounded-xl border-indigo-100 px-4 py-3 text-sm"
          >
            <span>
              The tenant form will be connected when your database is ready.
            </span>
            <Button
              onClick={() => setNotice(false)}
              color="link"
              className="p-0 font-semibold text-decoration-none"
            >
              Dismiss
            </Button>
          </Alert>
        )}
        <div className="mb-8">
          <p className="mb-1 text-sm font-medium text-slate-500">
            Tuesday, 19 August 2026
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Good morning, James <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your properties today.
          </p>
        </div>
        <StatsGrid />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
          <ActivityTable tenants={filteredTenants} query={query} />
          <InsightsPanel />
        </div>
      </section>
    </Container>
  );
}
