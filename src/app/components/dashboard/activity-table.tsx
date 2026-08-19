import Link from "next/link";
import { Badge, Card, CardBody, CardHeader, Table } from "reactstrap";
import { Icon } from "./dashboard-icon";
import type { TenantActivity } from "@/app/Types/dashboard";

function PaymentStatus({ status }: { status: string }) {
  const color =
    status === "Paid"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Overdue"
        ? "bg-rose-50 text-rose-700"
        : status === "Due today"
          ? "bg-amber-50 text-amber-700"
          : "bg-sky-50 text-sky-700";
  return (
    <Badge
      pill
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}
    >
      {status}
    </Badge>
  );
}

export function ActivityTable({
  tenants,
  query,
}: {
  tenants: TenantActivity[];
  query: string;
}) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-5 sm:px-6">
        <div>
          <h2 className="font-bold">Recent rent activity</h2>
          <p className="mt-1 text-xs text-slate-500">
            Track the latest tenant payments.
          </p>
        </div>
        <Link href="/payments" className="text-sm font-semibold text-[#4437d8]">
          View all payments
        </Link>
      </CardHeader>
      <CardBody className="overflow-x-auto p-0">
        <Table responsive className="mb-0 min-w-[610px] text-left">
          <thead className="bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-3.5">Tenant</th>
              <th className="px-4 py-3.5">Property</th>
              <th className="px-4 py-3.5">Amount</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-6 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr
                key={tenant.name}
                className="border-t border-slate-100 text-sm"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold ${tenant.color}`}
                    >
                      {tenant.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">
                        {tenant.name}
                      </p>
                      <p className="text-xs text-slate-400">{tenant.unit}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-500">{tenant.property}</td>
                <td className="px-4 py-4 font-semibold text-slate-700">
                  {tenant.amount}
                </td>
                <td className="px-4 py-4">
                  <PaymentStatus status={tenant.status} />
                </td>
                <td className="px-6 py-4 text-right text-slate-400">
                  <button aria-label={`More actions for ${tenant.name}`}>
                    <Icon name="dots" size={19} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {tenants.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-slate-500">
            No tenants match “{query}”.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
