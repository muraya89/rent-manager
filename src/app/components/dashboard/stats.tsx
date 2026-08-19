import { Card, CardBody, Col, Row } from "reactstrap";
import { Icon } from "./dashboard-icon";
import type { IconName } from "@/app/Types/dashboard";

const stats: {
  label: string;
  value: string;
  detail: string;
  accent: string;
  icon: IconName;
}[] = [
  {
    label: "Total properties",
    value: "12",
    detail: "2 added this year",
    accent: "bg-violet-500",
    icon: "building",
  },
  {
    label: "Occupancy rate",
    value: "92.4%",
    detail: "+3.2% from last month",
    accent: "bg-emerald-500",
    icon: "people",
  },
  {
    label: "Expected this month",
    value: "KES 486k",
    detail: "of KES 526k collected",
    accent: "bg-sky-500",
    icon: "receipt",
  },
  {
    label: "Outstanding rent",
    value: "KES 40k",
    detail: "4 tenants need a reminder",
    accent: "bg-amber-500",
    icon: "chart",
  },
];

export function StatsGrid() {
  return (
    <Row className="mb-8 g-4">
      {stats.map((stat) => (
        <Col key={stat.label} sm="6" xl="3">
          <Card className="relative h-full overflow-hidden rounded-2xl border-slate-200 shadow-sm">
            <CardBody>
              <div className={`absolute inset-x-0 top-0 h-1 ${stat.accent}`} />
              <div className=" flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <div className="rounded-lg bg-slate-50 p-2 text-slate-500">
                  <Icon name={stat.icon} size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="mt-2 text-xs text-slate-500">{stat.detail}</p>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
