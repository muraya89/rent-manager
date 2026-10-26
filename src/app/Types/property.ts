export interface Property {
  id: number;
  name: string;
  address: string;
  coverImageUrl: string;
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

export interface PropertyFormValues {
  name: string;
  image:  File | null ;
  address: string;
  monthlyRent: number;
}
