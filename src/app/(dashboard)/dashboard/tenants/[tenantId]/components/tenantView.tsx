"use client";

import { Badge, Button, Card, CardBody, Col, Row, Table } from "reactstrap";
import { useRouter } from "next/navigation";

interface TenantViewData {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt?: string;

  leases: Array<{
    id: number;
    startDate: string;
    endDate: string | null;
    monthlyRent: number | string;
    status: string;

    unit: {
      id: number;
      unitNumber: string;

      property: {
        id: number;
        name: string;
        address: string;
      };
    };

    rentCharges?: Array<{
      id: number;
      amount: number | string;
      dueDate: string;
      status: string;

      payments?: Array<{
        id: number;
        amount: number | string;
        date: string;
        method: string;
      }>;
    }>;
  }>;
}

interface TenantViewProps {
  tenant: TenantViewData;
}

export default function TenantView({ tenant }: TenantViewProps) {
  const router = useRouter();

  const activeLease = tenant.leases.find((lease) => lease.status === "ACTIVE");

  const rentCharges = activeLease?.rentCharges ?? [];

  const totalExpected = rentCharges.reduce(
    (total, charge) => total + Number(charge.amount),
    0,
  );

  const totalPaid = rentCharges.reduce(
    (total, charge) =>
      total +
      (charge.payments ?? []).reduce(
        (paymentTotal, payment) => paymentTotal + Number(payment.amount),
        0,
      ),
    0,
  );

  const outstanding = Math.max(totalExpected - totalPaid, 0);

  const monthlyRent = activeLease ? Number(activeLease.monthlyRent) : 0;

  const isActive = Boolean(activeLease);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => router.push("/dashboard/tenants")}
          className="mb-5 border-0 bg-transparent p-0 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back to Tenants
        </button>

        {/* Tenant Header */}
        <Card className="mb-5 border-0 shadow-sm">
          <CardBody className="p-4 p-md-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700">
                  {getInitials(tenant.name)}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                      {tenant.name}
                    </h1>

                    <Badge
                      color={isActive ? "success" : "secondary"}
                      pill
                      className={
                        isActive
                          ? "bg-emerald-100 px-3 py-1 text-emerald-700"
                          : "bg-slate-100 px-3 py-1 text-slate-600"
                      }
                    >
                      {isActive ? "Active tenant" : "No active lease"}
                    </Badge>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Tenant #{tenant.id}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {tenant.email || "No email"}
                    {tenant.phone && ` • ${tenant.phone}`}
                  </p>
                </div>
              </div>

              <Button
                color="primary"
                onClick={() =>
                  router.push(`/dashboard/tenants/${tenant.id}/edit`)
                }
                className="rounded-xl border-0 bg-indigo-600 px-5 py-2.5 shadow-none"
              >
                Edit Tenant
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Summary Cards */}
        <Row className="mb-4 g-4">
          <Col md="4">
            <SummaryCard
              label="Current Property"
              value={
                activeLease ? activeLease.unit.property.name : "No property"
              }
              subValue={
                activeLease
                  ? `Unit ${activeLease.unit.unitNumber}`
                  : "No active lease"
              }
            />
          </Col>

          <Col md="4">
            <SummaryCard
              label="Monthly Rent"
              value={activeLease ? formatCurrency(monthlyRent) : "—"}
              subValue={activeLease ? "Current lease" : "No active lease"}
            />
          </Col>

          <Col md="4">
            <SummaryCard
              label="Lease Status"
              value={activeLease ? "Active" : "No active lease"}
              subValue={
                activeLease
                  ? activeLease.endDate
                    ? `Ends ${formatDate(activeLease.endDate)}`
                    : "Open ended"
                  : "—"
              }
              status={isActive}
            />
          </Col>
        </Row>

        {/* Contact + Lease */}
        <Row className="mb-4 g-4">
          {/* Contact Information */}
          <Col lg="7">
            <Card className="h-full border-0 shadow-sm">
              <CardBody className="p-4 p-md-5">
                <SectionHeading
                  title="Contact Information"
                  description="Tenant contact details"
                />

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <DetailItem label="Full name" value={tenant.name} />

                  <DetailItem
                    label="Email address"
                    value={tenant.email || "Not provided"}
                  />

                  <DetailItem
                    label="Phone number"
                    value={tenant.phone || "Not provided"}
                  />

                  <DetailItem label="Tenant ID" value={`#${tenant.id}`} />
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Current Lease */}
          <Col lg="5">
            <Card className="h-full border-0 shadow-sm">
              <CardBody className="p-4 p-md-5">
                <SectionHeading
                  title="Current Lease"
                  description="Active tenancy details"
                />

                {activeLease ? (
                  <div className="mt-5 space-y-5">
                    <DetailItem
                      label="Property"
                      value={activeLease.unit.property.name}
                    />

                    <DetailItem
                      label="Unit"
                      value={`Unit ${activeLease.unit.unitNumber}`}
                    />

                    <DetailItem
                      label="Monthly rent"
                      value={formatCurrency(monthlyRent)}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <DetailItem
                        label="Start date"
                        value={formatDate(activeLease.startDate)}
                      />

                      <DetailItem
                        label="End date"
                        value={
                          activeLease.endDate
                            ? formatDate(activeLease.endDate)
                            : "Open ended"
                        }
                      />
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Status
                      </p>

                      <Badge
                        pill
                        className="bg-emerald-100 px-3 py-1 text-emerald-700"
                      >
                        {activeLease.status}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl bg-slate-50 p-5 text-center">
                    <p className="font-medium text-slate-700">
                      No active lease
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      This tenant is not currently assigned to a unit.
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Payment Summary */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardBody className="p-4 p-md-5">
            <SectionHeading
              title="Payment Summary"
              description="Financial overview for the current lease"
            />

            <Row className="mt-4 g-4">
              <Col md="4">
                <FinancialStat
                  label="Expected"
                  value={formatCurrency(totalExpected)}
                />
              </Col>

              <Col md="4">
                <FinancialStat
                  label="Paid"
                  value={formatCurrency(totalPaid)}
                  type="success"
                />
              </Col>

              <Col md="4">
                <FinancialStat
                  label="Outstanding"
                  value={formatCurrency(outstanding)}
                  type={outstanding > 0 ? "warning" : "success"}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Payment History */}
        <Card className="border-0 shadow-sm">
          <CardBody className="p-4 p-md-5">
            <SectionHeading
              title="Payment History"
              description="Payments recorded against this tenant's current lease"
            />

            {rentCharges.length > 0 ? (
              <div className="mt-5 overflow-x-auto">
                <Table borderless responsive className="mb-0 align-middle">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Period
                      </th>

                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Expected
                      </th>

                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Paid
                      </th>

                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Outstanding
                      </th>

                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rentCharges.map((charge) => {
                      const paid = (charge.payments ?? []).reduce(
                        (total, payment) => total + Number(payment.amount),
                        0,
                      );

                      const amount = Number(charge.amount);
                      const balance = Math.max(amount - paid, 0);

                      return (
                        <tr
                          key={charge.id}
                          className="border-b border-slate-50"
                        >
                          <td className="py-4 font-medium text-slate-700">
                            {formatDate(charge.dueDate)}
                          </td>

                          <td className="py-4 text-slate-600">
                            {formatCurrency(amount)}
                          </td>

                          <td className="py-4 text-slate-600">
                            {formatCurrency(paid)}
                          </td>

                          <td className="py-4 text-slate-600">
                            {formatCurrency(balance)}
                          </td>

                          <td className="py-4">
                            <PaymentStatus paid={paid} amount={amount} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="mt-5 rounded-xl bg-slate-50 p-8 text-center">
                <p className="font-medium text-slate-700">No payment history</p>

                <p className="mt-1 text-sm text-slate-500">
                  There are no rent charges recorded for the current lease.
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Components */
/* ---------------------------------- */

function SummaryCard({
  label,
  value,
  subValue,
  status,
}: {
  label: string;
  value: string;
  subValue: string;
  status?: boolean;
}) {
  return (
    <Card className="h-full border-0 shadow-sm">
      <CardBody className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p
          className={`mt-3 text-lg font-semibold ${
            status === true ? "text-emerald-600" : "text-slate-900"
          }`}
        >
          {value}
        </p>

        <p className="mt-1 text-sm text-slate-500">{subValue}</p>
      </CardBody>
    </Card>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>

      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="break-words text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}

function FinancialStat({
  label,
  value,
  type,
}: {
  label: string;
  value: string;
  type?: "success" | "warning";
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-semibold ${
          type === "success"
            ? "text-emerald-600"
            : type === "warning"
              ? "text-amber-600"
              : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PaymentStatus({ paid, amount }: { paid: number; amount: number }) {
  if (paid >= amount) {
    return (
      <Badge pill className="bg-emerald-100 px-3 py-1 text-emerald-700">
        Paid
      </Badge>
    );
  }

  if (paid > 0) {
    return (
      <Badge pill className="bg-amber-100 px-3 py-1 text-amber-700">
        Partial
      </Badge>
    );
  }

  return (
    <Badge pill className="bg-red-100 px-3 py-1 text-red-700">
      Unpaid
    </Badge>
  );
}

/* ---------------------------------- */
/* Helpers */
/* ---------------------------------- */

function formatCurrency(value: number) {
  return `KES ${value.toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
