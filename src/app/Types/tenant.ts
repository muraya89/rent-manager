import {
  expiringSoonTenants,
  getLeasedTenant,
  getNotLeasedTenant,
  getTenant,
  getTenants,
  NewTenant,
} from "@/lib/queries/tenantQueries";

export type TenantMode = "new" | "existing";

export type Tenant = NonNullable<Awaited<ReturnType<typeof getTenant>>>;

export type TenantListItem = Awaited<ReturnType<typeof getTenants>>[number];

export interface TenantFormValues {
  tenant: {
    name: string;
    email: string;
    phone: string;
  };
  tenantId: number;
  unitId: number;
  propertyId: number;
  lease: {
    startDate: string;
    endDate: string;
    monthlyRent: number;
    depositAmount: number;
    rentDueDay: number;
    occupants: number;
  };
  isOccupied: boolean;
  tenantMode: TenantMode;
}

export type TenantViewData = NonNullable<Awaited<ReturnType<typeof getTenant>>>;

export type leasedTenants = NonNullable<
  Awaited<ReturnType<typeof getLeasedTenant>>
>;

export type NewTenant = NonNullable<Awaited<ReturnType<typeof NewTenant>>>;

export type expiringTenants = NonNullable<
  Awaited<ReturnType<typeof expiringSoonTenants>>
>;

export type unleasedTenants = NonNullable<
  Awaited<ReturnType<typeof getNotLeasedTenant>>
>;
