"use client";

import Link from "next/link";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";

export default function SectionPage({
  title,
  description,
  properties,
}: {
  properties: any[];
  title: string;
  description: string;
}) {
  return (
    <main className="min-h-screen bg-[#f7f8fc] py-8 text-[#18212f]">
      <Container className="max-w-5xl px-5 sm:px-8 lg:px-12">
        <Button
          tag={Link}
          href="/dashboard"
          color="link"
          className="inline-flex items-center gap-2 p-0 text-sm font-semibold text-[#4437d8] text-decoration-none"
        >
          ← Back to overview
        </Button>

        <Card className="mt-8 overflow-hidden rounded-2xl border-slate-200 shadow-sm">
          <CardBody className="p-0">
            <div className="bg-gradient-to-br from-[#29205f] via-[#4437d8] to-[#6f62f0] px-7 py-9 text-white sm:px-10 sm:py-12">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[.14em] text-indigo-100">
                Rentwise workspace
              </span>
              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                {description}
              </p>
            </div>
            <div className="p-7 sm:p-10">
              {properties.length > 0 ? (
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <tr key={property.id}>
                        <td>{property.name}</td>
                        <td>{property.address}</td>
                        <td>{property.units.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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
          </CardBody>
        </Card>
      </Container>
    </main>
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
