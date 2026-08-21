import SectionPage from "./components/section-page";
import { prisma } from "@/lib/prisma";

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    select: {
      id: true,
      amount: true,
      paidAt: true,
      method: true,
      reference: true,
      rentCharge: {
        select: {
          period: true,
        },
      },
    },
  });

  const paymentRows = payments.map((payment) => ({
    id: payment.id,
    amount: payment.amount.toString(),
    paidAt: payment.paidAt.toISOString(),
    method: payment.method,
    reference: payment.reference,
    period: payment.rentCharge.period,
  }));
  return (
    <SectionPage
      title="Payments"
      description="Record rent collections and follow up on outstanding balances."
      payments={paymentRows}
    />
  );
}
