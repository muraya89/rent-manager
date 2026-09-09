import SectionPage from "./components/section-page";
import { prisma } from "@/lib/prisma";
import { serializeData } from "@/lib/helpers/helper";

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    select: {
      id: true,
      amount: true,
      // Exclude paidAt date field to avoid MariaDbAdapter issues
      method: true,
      reference: true,
      rentCharge: {
        select: {
          period: true,
          // Exclude date fields to avoid MariaDbAdapter issues
        },
      },
    },
  });

  const paymentRows = payments.map((payment) => ({
    id: payment.id,
    amount: payment.amount.toString(),
    // paidAt: payment.paidAt.toISOString(), // Exclude this for now
    method: payment.method,
    reference: payment.reference,
    period: payment.rentCharge.period,
  }));

  // Serialize the entire array to handle any Date issues
  const serializedPayments = serializeData(paymentRows);

  return (
    <SectionPage
      title="Payments"
      description="Record rent collections and follow up on outstanding balances."
      payments={serializedPayments}
    />
  );
}
