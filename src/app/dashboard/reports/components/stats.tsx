import { Card, CardBody, Col, Row } from "reactstrap";
import { Icon } from "../../dashboard-icon";
import type { IconName } from "@/app/Types/dashboard";
import type { DashboardStat } from "@/app/Types/dashboard";


export function StatsGrid({ stats }: { stats: DashboardStat[] }) {
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
