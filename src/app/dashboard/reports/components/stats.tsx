import { Card, CardBody, Col, Row } from "reactstrap";
import type { DashboardStat } from "@/app/Types/dashboard";
import { formatMoney as money } from "@/lib/helpers/helper";

const fulfillmentPercentage = ({
  total,
  amount,
}: {
  total: number;
  amount: number;
}) => {
  return total > 0 ? Math.min(100, Math.round((amount / total) * 100)) : 0;
};

const FulfillmentStat = ({
  total,
  amount,
}: {
  total: number;
  amount: number;
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
      {stats.map((stat, i) => (
        <Col key={stat.label} sm="6" xl="3">
          <Card
            className={`relative h-100 overflow-hidden rounded-2xl ${i == 0 && "bg-primary text-white"}`}
            // style={{ ...(i === 0 && { backgroundColor: "red" }) }}
          >
            <CardBody>
              <div className={`absolute top-0 h-1 ${stat.accent}`} />
              <div className=" flex items-center justify-between">
                <p className="text-sm font-medium text-uppercase">
                  {stat.label}
                </p>
              </div>
              <p
                className={`text-2xl font-bold tracking-tight ${i == 1 && "text-[#9A4A00]"}`}
              >
                {i === 0 ? money(stat.amount) : stat.value}
              </p>

              {i === 0 ? (
                <div>
                  <FulfillmentStat amount={stat.amount} total={stat.total} />
                </div>
              ) : (
                <p className="mt-2 text-xs text-(--secondary-text)">{stat.detail}</p>
              )}
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
