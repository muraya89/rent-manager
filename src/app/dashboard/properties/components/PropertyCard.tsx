import { Card, Badge, CardBody, CardTitle, Row, Col } from "reactstrap";
import { Property } from "@/app/Types";
import BadgeComponent from "@/app/shared-components/badge";
import Image from "next/image";
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
      className="h-100 overflow-hidden border-0 shadow-xs p-4"
      style={{
        cursor: "pointer",
        borderRadius: "22px",
      }}
      onClick={onClick}
    >
      {/* Image */}
      {property.coverImageUrl ? (
        <Image
          src={property.coverImageUrl}
          alt={property.name}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="grid h-40 place-items-center bg-(--primary) text-4xl font-bold text-white">
          {property.name.slice(0, 2).toUpperCase()}
        </div>
      )}
      {/* <div
        style={{
          height: "180px",
          backgroundImage: "url('https://picsum.photos/600/400')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          borderRadius: "22px",
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
      </div> */}

      <CardBody>
        {/* Name */}
        <CardTitle tag="h5" className="mb-1 fw-semibold">
          {property.name}
        </CardTitle>

        {/* Address */}
        <div className="text-muted small mb-4">📍 {property.address}</div>

        {/* Unit stats */}
        <div className="flex gap-2">
          <BadgeComponent
            pill
            textColor="text-primary"
            bgColor="bg-(--primary-light)"
            caption={`${totalUnits} Units`}
          />

          <BadgeComponent
            pill
            textColor="text-success"
            bgColor="bg-success-subtle"
            caption={`${occupiedUnits} Occupied`}
          />

          <BadgeComponent
            pill
            textColor="text-warning"
            bgColor="bg-warning-subtle"
            caption={`${vacantUnits} Vacant`}
          />
        </div>

        {/* Occupancy */}
        <div className="my-3">
          <div className="d-flex justify-content-between mb-2">
            <span className="small font-bold">Occupancy</span>

            <span className="small font-bold">{occupancyRate}%</span>
          </div>

          <div className="p--progress" style={{ height: "7px" }}>
            <div
              className="p--progress-bar"
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
