import { Card, CardBody } from "reactstrap";
export default function StatCard({
  label,
  value,
  icon,
  secondary,
}: {
  label: string;
  value: number;
  icon: string;
  secondary?: string;
}) {
  return (
    <Card className="border-0 shadow-sm h-100">
      <CardBody className="p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="text-muted small mb-2">{label}</div>

            <div className="fs-3 fw-semibold">{value}</div>

            {secondary && (
              <div className="small text-muted mt-1">{secondary}</div>
            )}
          </div>

          <div
            className="rounded-3 d-flex align-items-center justify-content-center"
            style={{
              width: "42px",
              height: "42px",
              background: "#f0efff",
              color: "#4437d8",
            }}
          >
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
