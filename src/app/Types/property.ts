import { getProperties } from "@/lib/queries/propertyQueries";

export type Property = Awaited<ReturnType<typeof getProperties>>[number];

export interface PropertyFormValues {
  name: string;
  image:  File | null ;
  address: string;
  monthlyRent: number;
}
