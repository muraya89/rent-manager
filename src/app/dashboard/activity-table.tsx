import Link from "next/link";
import { Badge, Card, CardBody, CardHeader, Table, Row, Col } from "reactstrap";
import { Icon } from "./dashboard-icon";
import { formatMoney as money } from "@/lib/helpers/helper";
import EmptyState from "@/app/shared-components/emptyState";

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
  tenants: any[];
  query: string;
}) {
  return (
    <Card className="rounded-2xl border-0">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-0 bg-white py-3">
        <div>
          <span className="font-bold text-xl">Recent rent activity</span>
          <p className="text-xs text-slate-500">Latest tenant payments.</p>
        </div>
        <Link
          href="/dashboard/payments"
          className="text-sm font-semibold text-(--primary)!"
        >
          View all
        </Link>
      </CardHeader>
      <CardBody className="overflow-x-auto py-0">
        <Table responsive className="mb-0 min-w-152.5 text-left">
          <thead className="text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-3.5">Tenant</th>
              <th className="px-4 py-3.5">Property</th>
              <th className="px-4 py-3.5">Amount</th>
              <th className="px-4 py-3.5">Status</th>
              {/* <th className="px-6 py-3.5" /> */}
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
                      className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-(--primary) bg-(--primary-light)`}
                    >
                      {tenant.initials}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 mb-0">
                        {tenant.name}
                      </p>
                      <p className="text-xs text-slate-400 mb-0">
                        {tenant.unit}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-500">{tenant.property}</td>
                <td className="px-4 py-4 font-semibold text-slate-700">
                  {money(tenant.amount)}
                </td>
                <td className="px-4 py-4">
                  <PaymentStatus status={tenant.status} />
                </td>
                {/* <td className="px-6 py-4 text-right text-slate-400">
                  <button aria-label={`More actions for ${tenant.name}`}>
                    <Icon name="dots" size={19} />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </Table>
        {tenants.length === 0 && (
          <Row className="g-4 py-4">
            <Col md="12">
              <EmptyState title="recent activity" />
            </Col>
          </Row>
        )}
      </CardBody>
    </Card>
  );
}
