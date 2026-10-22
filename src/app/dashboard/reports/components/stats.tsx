import { Card, CardBody, Col, Row } from "reactstrap";
import type { DashboardStat } from "@/app/Types/dashboard";
import { formatMoney as money } from "@/lib/helpers/helper";

const fulfillmentPercentage = ({
  total,
  amount,
}: {
  total?: number;
  amount?: number;
}) => {
  return total > 0 ? Math.min(100, Math.round((amount / total) * 100)) : 0;
};

const FulfillmentStat = ({
  total,
  amount,
}: {
  total?: number;
  amount?: number;
}) => (
  <>
    <div className="progress">
      <div
        className={`progress-bar`}
        style={{ width: `${fulfillmentPercentage({ total, amount })}%` }}
      />
    </div>
    <div className="fulfillment-stats">
      <span className="fulfillment-stat-value">
        {`${fulfillmentPercentage({ total, amount })}%`}
      </span>{" "}
      of
      <span className="fulfillment-stat-value"> {money(total)}</span>
    </div>
  </>
);

export function StatsGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <Row className="mb-8 g-4">
      {stats.map((stat) => (
        <Col key={stat.label} sm="6" xl="3">
          <Card
            className={`relative h-100 overflow-hidden rounded-2xl border-0`}
          >
            <CardBody className={` ${stat.className}`}>
              <div className={`absolute top-0 h-1`} />
              <div className=" flex items-center justify-between">
                <p className="text-sm font-medium text-uppercase">
                  {stat.label}
                </p>
              </div>
              <p
                className={`text-2xl font-bold tracking-tight ${stat.className}`}
              >
                {stat.progress ? money(stat.amount) : stat.value}
              </p>

              {stat.progress ? (
                <div>
                  <FulfillmentStat amount={stat.amount} total={stat.total} />
                </div>
              ) : (
                <p className="mt-2 text-xs text-secondary">{stat.detail}</p>
              )}
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
