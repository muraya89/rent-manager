export type TenantMode = "new" | "existing";

export interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface TenantFormValues {
  name: string;
  email: string;
  phone: string;
  tenantMode: string
}
