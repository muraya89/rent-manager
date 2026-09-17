import { Card, Badge, CardBody, CardTitle, Row, Col } from "reactstrap";
import { Property } from "@/app/Types";
export default function PropertyCard({
  property,
  onClick,
}: {
  property: Property;
  onClick: () => void;
}) {
  const totalUnits = property.units.length;

  const occupiedUnits = property.units.filter(
    (unit) => unit.leases && unit.leases.length > 0,
  ).length;

  const vacantUnits = totalUnits - occupiedUnits;

  const occupancyRate =
    totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  return (
    <Card
      className="h-100 overflow-hidden border-0 shadow-sm"
      style={{
        cursor: "pointer",
        borderRadius: "16px",
      }}
      onClick={onClick}
    >
      {/* Image */}
      <div
        style={{
          height: "180px",
          backgroundImage: "url('https://picsum.photos/600/400')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
          }}
        >
          <Badge
            color={occupancyRate === 100 ? "success" : "dark"}
            className="px-3 py-2 rounded-pill"
          >
            {occupiedUnits}/{totalUnits} occupied
          </Badge>
        </div>
      </div>

      <CardBody className="p-4">
        {/* Name */}
        <CardTitle tag="h5" className="mb-1 fw-semibold">
          {property.name}
        </CardTitle>

        {/* Address */}
        <div className="text-muted small mb-4">📍 {property.address}</div>

        {/* Unit stats */}
        <Row className="g-2 mb-4">
          <Col xs="4">
            <div className="bg-light rounded-3 p-3 text-center">
              <div className="fw-bold fs-5">{totalUnits}</div>

              <div className="text-muted small">Units</div>
            </div>
          </Col>

          <Col xs="4">
            <div className="bg-success-subtle rounded-3 p-3 text-center">
              <div className="fw-bold fs-5 text-success">{occupiedUnits}</div>

              <div className="text-muted small">Occupied</div>
            </div>
          </Col>

          <Col xs="4">
            <div className="bg-warning-subtle rounded-3 p-3 text-center">
              <div className="fw-bold fs-5 text-warning">{vacantUnits}</div>

              <div className="text-muted small">Vacant</div>
            </div>
          </Col>
        </Row>

        {/* Occupancy */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span className="small text-muted">Occupancy</span>

            <span className="small fw-semibold">{occupancyRate}%</span>
          </div>

          <div className="progress" style={{ height: "7px" }}>
            <div
              className="progress-bar"
              style={{
                width: `${occupancyRate}%`,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-top pt-3 d-flex justify-content-between align-items-center">
          <div>
            <div className="text-muted small">Monthly rent</div>

            <div className="fw-semibold">
              KES {property.monthlyRent.toLocaleString()}
            </div>
          </div>

          <span className="text-primary fw-semibold small">
            View property →
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
