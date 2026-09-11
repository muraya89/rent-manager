export interface Property {
  id: number;
  name: string;
  address: string;
  monthlyRent: number;
  units: Array<{
    id: number;
    unitNumber: string;
    monthlyRent: number;
    leases: Array<{
      id: number;
      tenant: {
        name: string;
      };
    }>;
  }>;
}
