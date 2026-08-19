export interface Payment {
  id: number;
  tenantId: number;
  propertyId: number;
  amount: number;
  paid: boolean;
  date: string;
  method: "cash" | "credit_card" | "bank_transfer" | "check";
}
