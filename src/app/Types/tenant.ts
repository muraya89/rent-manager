export interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  propertyId: number;
}

export interface TenantFormValues {
  name: string;
  email: string;
  phone: string;
}