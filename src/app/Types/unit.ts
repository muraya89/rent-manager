import { TenantMode } from "./tenant";
import type { viewUnit } from "@/lib/queries/unitQueries";

export interface Unit {
  id: number;
  unitNumber: string;
  monthlyRent: number;
  defaultDeposit?: number;
  leases: any;
  propertyId: number;
}

export interface UnitFormValues {
  unitNumber: string;
  monthlyRent: number;
  isOccupied: boolean;
  defaultDeposit: number;

  tenant: {
    name: string;
    email: string;
    phone: string;
  };
  tenantId: string | null;

  lease: {
    // tenantId: number;
    // unitId: number;
    startDate: string;
    endDate?: string;
    monthlyRent: number;
    depositAmount: number | "";
    rentDueDay: number;
    occupants: number;
  };
  tenantMode: TenantMode;
}

export type UnitViewData = NonNullable<Awaited<ReturnType<typeof viewUnit>>>;

export type OccupiedSwitchProps = {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  title?: string;
  description?: string;
};
