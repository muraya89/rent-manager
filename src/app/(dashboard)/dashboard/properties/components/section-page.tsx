"use client";

import { Badge, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import { useRouter } from "next/navigation";
import SectionPage from "@/app/shared-components/section-page";
import { Property } from "@/app/Types/index";
import StatCard from "./StatCrd"
import PropertyCard from "./PropertyCard"

export default function PropertiesSectionPage({
  title,
  description,
  properties,
}: {
  properties: Property[];
  title: string;
  description: string;
}) {
  const router = useRouter();

  const totalUnits = properties.reduce(
    (total, property) => total + property.units.length,
    0,
  );

  const occupiedUnits = properties.reduce(
    (total, property) =>
      total +
      property.units.filter((unit) => unit.leases && unit.leases.length > 0)
        .length,
    0,
  );

  const vacantUnits = totalUnits - occupiedUnits;

  return (
    <SectionPage title={title} description={description}>
      <div className="mt-4 px-4 pb-5">
        {/* Stats */}
        <Row className="g-3 mb-4">
          <Col md="4">
            <StatCard label="Properties" value={properties.length} icon="🏢" />
          </Col>

          <Col md="4">
            <StatCard label="Total Units" value={totalUnits} icon="▦" />
          </Col>

          <Col md="4">
            <StatCard
              label="Occupied Units"
              value={occupiedUnits}
              icon="✓"
              secondary={`${vacantUnits} vacant`}
            />
          </Col>
        </Row>

        {/* Property cards */}
        {properties.length > 0 ? (
          <Row className="g-4">
            {properties.map((property) => (
              <Col key={property.id} md="6" xl="4">
                <PropertyCard
                  property={property}
                  onClick={() =>
                    router.push(`/dashboard/properties/${property.id}`)
                  }
                />
              </Col>
            ))}
          </Row>
        ) : (
          <EmptyState title={title} />
        )}
      </div>
    </SectionPage>
  );
}
