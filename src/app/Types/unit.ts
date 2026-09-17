export interface Unit {
  id: number;
  unitNumber: string;
  monthlyRent: number;
}

export interface UnitFormValues {
  unitNumber: string;
  monthlyRent: number;
  isOccupied: false;

  name: string;
  email: string;
  phone: string;
}

export interface UnitViewData {
  id: number;
  unitNumber: string;
  monthlyRent: number;
  propertyId: number;
  isOccupied: boolean;

  createdAt: string;
  updatedAt: string;

  property: {
    id: number;
    name: string;
    address: string;
    monthlyRent: number;
    createdAt: string;
    updatedAt: string;
  };

  leases: {
    id: number;
    tenantId: number;
    unitId: number;
    startDate: string;
    endDate: string | null;
    monthlyRent: number;
    status: "ACTIVE" | "EXPIRED" | "TERMINATED";
    createdAt: string;
    updatedAt: string;

    tenant: {
      id: number;
      name: string;
      email: string;
      phone: string;
      createdAt: string;
      updatedAt: string;
    };

    rentCharges: {
      id: number;
      leaseId: number;
      amount: number;
      dueDate: string;
      period: string;
      status: "UNPAID" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";
      createdAt: string;
      updatedAt: string;

      payments: {
        id: number;
        rentChargeId: number;
        amount: number;
        paidAt: string;
        method: "CASH" | "MPESA" | "BANK_TRANSFER" | "CARD" | "OTHER";
        reference: string | null;
        createdAt: string;
        updatedAt: string;
      }[];
    }[];
  }[];
}