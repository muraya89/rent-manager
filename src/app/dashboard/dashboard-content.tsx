"use client";

import { useMemo, useState } from "react";
import { Alert, Button, Container } from "reactstrap";
import type { TenantActivity } from "@/app/Types/dashboard";
import { ActivityTable } from "./activity-table";
import { DashboardHeader } from "./header";
import { InsightsPanel } from "./reports/components/insights";
import { StatsGrid } from "./reports/components/stats";
import type { DashboardStat } from "@/app/Types/dashboard";

export default function DashboardContent({
  tenants,
  stats,
  collection,
}: {
  tenants: TenantActivity[];
  stats: DashboardStat[];
  collection: {
    collected: number;
    expected: number;
  };
}) {
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState(false);
  const filteredTenants = useMemo(
    () =>
      tenants.filter((tenant) =>
        `${tenant.name} ${tenant.unit} ${tenant.property}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, tenants],
  );

  return (
    <Container
      fluid
      className="mx-auto flex min-h-screen w-full max-w-none px-0"
    >
      <section className="min-w-0 flex-1 py-4 lg:py-7">
        <DashboardHeader
          query={query}
          onQueryChange={setQuery}
          onAddTenant={() => setNotice(true)}
          onOpenMenu={() => undefined}
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
            Thursday, 20 August 2026
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Good morning, James <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your properties today.
          </p>
        </div>
        <StatsGrid stats={stats} />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
          <ActivityTable tenants={filteredTenants} query={query} />
          <InsightsPanel collection={collection} />
        </div>
      </section>
    </Container>
  );
}
