"use client";

import { Badge, Button, Card, CardBody, Col, Row } from "reactstrap";
import { useMemo } from "react";

type PaymentRow = {
  id: number;
  amount: string | number;
  paidAt: string;
  method: string;
  reference: string | null;
  period: string;
};

export default function PaymentsSectionPage({
  title,
  description,
  payments,
}: {
  payments: PaymentRow[];
  title: string;
  description: string;
}) {
  const totalCollected = useMemo(
    () =>
      payments.reduce((total, payment) => total + Number(payment.amount), 0),
    [payments],
  );

  const averagePayment =
    payments.length > 0 ? totalCollected / payments.length : 0;

  const latestPayment = useMemo(() => {
    if (!payments.length) return null;

    return [...payments].sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime(),
    )[0];
  }, [payments]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600">
              Finance
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              {description}
            </p>
          </div>

          <Button
            color="primary"
            className="flex items-center justify-center gap-2 rounded-xl border-0 bg-indigo-600 px-5 py-2.5 font-medium shadow-sm transition hover:bg-indigo-700"
          >
            <span className="text-lg leading-none">+</span>
            Record payment
          </Button>
        </div>

        {payments.length > 0 ? (
          <>
            {/* Financial overview */}
            <div className="mb-6 overflow-hidden rounded-2xl bg-slate-900 shadow-sm">
              <div className="grid md:grid-cols-3">
                <HeroStat
                  label="Total collected"
                  value={formatCurrency(totalCollected)}
                  description="All recorded payments"
                  primary
                />

                <HeroStat
                  label="Payments received"
                  value={payments.length.toString()}
                  description={
                    payments.length === 1
                      ? "Recorded transaction"
                      : "Recorded transactions"
                  }
                />

                <HeroStat
                  label="Average payment"
                  value={formatCurrency(averagePayment)}
                  description="Average transaction value"
                />
              </div>
            </div>

            {/* Main content */}
            <Row className="g-4">
              {/* Payment list */}
              <Col lg="8">
                <Card className="border-0 shadow-sm">
                  <CardBody className="p-0">
                    {/* Card header */}
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
                      <div>
                        <h2 className="text-base font-semibold text-slate-900">
                          Payment history
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Recent rent payments
                        </p>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                        {payments.length}{" "}
                        {payments.length === 1 ? "payment" : "payments"}
                      </span>
                    </div>

                    {/* Payment rows */}
                    <div>
                      {payments.map((payment, index) => (
                        <PaymentItem
                          key={payment.id}
                          payment={payment}
                          isLast={index === payments.length - 1}
                        />
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </Col>

              {/* Right column */}
              <Col lg="4">
                {/* Latest payment */}
                <Card className="border-0 shadow-sm">
                  <CardBody className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                      Latest payment
                    </p>

                    {latestPayment ? (
                      <>
                        <div className="mt-5 flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-semibold tracking-tight text-slate-900">
                              {formatCurrency(Number(latestPayment.amount))}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {formatDate(latestPayment.paidAt)}
                            </p>
                          </div>

                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                            <span className="text-xl text-emerald-600">✓</span>
                          </div>
                        </div>

                        <div className="mt-5 border-t border-slate-100 pt-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-500">
                              Period
                            </span>

                            <span className="text-sm font-medium text-slate-700">
                              {latestPayment.period}
                            </span>
                          </div>

                          <div className="mt-3 flex justify-between">
                            <span className="text-sm text-slate-500">
                              Method
                            </span>

                            <PaymentMethod method={latestPayment.method} />
                          </div>

                          <div className="mt-3 flex justify-between gap-4">
                            <span className="text-sm text-slate-500">
                              Reference
                            </span>

                            <span className="truncate text-right text-sm font-medium text-slate-700">
                              {latestPayment.reference || "—"}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="mt-4 text-sm text-slate-500">
                        No payments recorded yet.
                      </p>
                    )}
                  </CardBody>
                </Card>

                {/* Quick action */}
                <Card className="mt-4 overflow-hidden border-0 bg-indigo-600 shadow-sm">
                  <CardBody className="p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl text-white">
                      +
                    </div>

                    <h3 className="mt-5 text-base font-semibold text-white">
                      Record a payment
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-indigo-100">
                      Add a rent payment, select the payment method, and keep
                      the tenant's balance up to date.
                    </p>

                    <Button
                      color="light"
                      className="mt-5 rounded-xl border-0 px-4 py-2 font-medium text-indigo-700 shadow-none"
                    >
                      Record payment
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <EmptyPayments />
        )}
      </div>
    </div>
  );
}

/* ========================================================= */
/* Hero Stat */
/* ========================================================= */

function HeroStat({
  label,
  value,
  description,
  primary = false,
}: {
  label: string;
  value: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <div
      className={`px-6 py-6 ${
        !primary ? "border-t border-slate-700 md:border-l md:border-t-0" : ""
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
}

/* ========================================================= */
/* Payment Item */
/* ========================================================= */

function PaymentItem({
  payment,
  isLast,
}: {
  payment: PaymentRow;
  isLast: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between ${
        !isLast ? "border-b border-slate-100" : ""
      }`}
    >
      {/* Left */}
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-semibold text-indigo-600">
          {getMethodIcon(payment.method)}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-800">
              {formatCurrency(Number(payment.amount))}
            </p>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
              Completed
            </span>
          </div>

          <div className="mt-1 flex flex-wrap gap-x-2 text-xs text-slate-400">
            <span>{payment.period}</span>

            <span>•</span>

            <span>{formatDate(payment.paidAt)}</span>

            {payment.reference && (
              <>
                <span>•</span>
                <span>Ref: {payment.reference}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:shrink-0">
        <PaymentMethod method={payment.method} />

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border-0 bg-transparent text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="View payment"
        >
          →
        </button>
      </div>
    </div>
  );
}

/* ========================================================= */
/* Payment Method */
/* ========================================================= */

function PaymentMethod({ method }: { method: string }) {
  return (
    <span className="inline-flex whitespace-nowrap rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
      {formatMethod(method)}
    </span>
  );
}

/* ========================================================= */
/* Empty State */
/* ========================================================= */

function EmptyPayments() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Card className="border-0 shadow-sm">
        <CardBody className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
            KES
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-800">
            No payments yet
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Payments you record will appear here. You can track the amount,
            period, payment method and reference for every transaction.
          </p>

          <Button
            color="primary"
            className="mt-6 rounded-xl border-0 bg-indigo-600 px-5 py-2.5 shadow-none"
          >
            + Record payment
          </Button>
        </CardBody>
      </Card>

      <Card className="border-0 bg-slate-900 shadow-sm">
        <CardBody className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            Payments
          </p>

          <h3 className="mt-3 text-lg font-semibold text-white">
            Keep your rent records organized
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Record payments as they come in to keep tenant balances and payment
            history accurate.
          </p>

          <div className="mt-6 space-y-3">
            <Feature text="Track payment amounts" />
            <Feature text="Record payment methods" />
            <Feature text="Keep transaction references" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/* ========================================================= */
/* Feature */
/* ========================================================= */

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-xs text-emerald-400">
        ✓
      </div>

      <span className="text-sm text-slate-300">{text}</span>
    </div>
  );
}

/* ========================================================= */
/* Helpers */
/* ========================================================= */

function formatCurrency(value: number) {
  return `KES ${value.toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatMethod(value: string) {
  const labels: Record<string, string> = {
    cash: "Cash",
    mpesa: "M-Pesa",
    credit_card: "Card",
    bank_transfer: "Bank transfer",
    check: "Cheque",
    cheque: "Cheque",
  };

  return (
    labels[value.toLowerCase()] ??
    value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

function getMethodIcon(method: string) {
  const normalized = method.toLowerCase();

  if (normalized === "cash") return "K";
  if (normalized === "mpesa") return "M";
  if (normalized === "bank_transfer") return "↗";
  if (normalized === "credit_card") return "▣";

  return "₿";
}
