export type IconName = "grid" | "building" | "people" | "receipt" | "chart" | "bell" | "search" | "plus" | "arrow" | "dots";

export type TenantActivity = {
  name: string;
  unit: string;
  property: string;
  amount: string;
  status: string;
  initials: string;
  color: string;
};

export type DashboardStat = {
  label: string;
  value: string;
  detail: string;
  accent: string;
  icon: "building" | "people" | "receipt" | "chart";
};

export type CollectionProgress = {
  collected: number;
  expected: number;
};
