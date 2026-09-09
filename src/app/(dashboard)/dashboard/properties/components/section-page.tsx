"use client";

import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Col,
  Row,
  Badge,
} from "reactstrap";
import SectionPage from "@/app/shared-components/section-page";
import { Property } from "@/app/Types/index";
import { useRouter } from "next/navigation";

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
  return (
    <SectionPage title={title} description={description}>
      <div className="">
        {properties.length > 0 ? (
          <Row>
            {properties.map((property) => (
              <Col key={property.id} md="4">
                <Card
                  style={{
                    width: "18rem",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    router.push(`/dashboard/properties/${property.id}`)
                  }
                >
                  <img
                    alt="Sample"
                    src="https://picsum.photos/300/200"
                    className="rounded-t-xl"
                  />
                  <CardBody>
                    <CardTitle tag="h5">{property.name}</CardTitle>
                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                      {property.address}
                    </CardSubtitle>
                    <CardText>
                      <Badge color="secondary">
                        {property.units.length} &thinsp; units
                      </Badge>
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Row className="g-4">
            <Col md="8">
              <EmptyState title={title} />
            </Col>
            <Col md="4">
              <QuickAction title={title} />
            </Col>
          </Row>
        )}
      </div>
    </SectionPage>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-100 text-xl font-light text-[#4437d8]">
        +
      </div>
      <p className="font-semibold text-slate-700">
        Your {title.toLowerCase()} will appear here.
      </p>
      <p className="mt-2 text-sm text-slate-500">
        This route is ready for its data table and create form.
      </p>
    </div>
  );
}

function QuickAction({ title }: { title: string }) {
  const singular = title.endsWith("ies")
    ? `${title.slice(0, -3)}y`
    : title.slice(0, -1);
  return (
    <Card className="h-full border-indigo-100 bg-indigo-50 shadow-none">
      <CardBody className="p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-[#4437d8]">
          Quick action
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Start by adding your first record to make this area useful.
        </p>
        <Button color="primary" className="mt-4 rounded-xl px-4 py-2">
          Add {singular}
        </Button>
      </CardBody>
    </Card>
  );
}
