"use client";

import { Button, Card, CardBody, Col, Row, Table } from "reactstrap";
import SectionPage from "@/app/shared-components/section-page";
import { Property } from "@/app/Types/index";
import { Fragment, useState } from "react";
import { formatMoney as money } from "@/lib/helpers/helper";


export default function PropertiesSectionPage({
  title,
  description,
  properties,
}: {
  properties: Property[];
  title: string;
  description: string;
}) {
  const [isViewingUnits, setIsViewingUnits] = useState<number | null>(
    properties[0]?.id ?? null,
  );
  const handleViewUnits = (propertyId: number) => {
    // Implement the logic to navigate to the units page for the selected property
    setIsViewingUnits(propertyId);
  };
  return (
    <SectionPage title={title} description={description}>
      <div className="p-7 sm:p-10">
        {properties.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Units</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <Fragment key={property.id}>
                  <tr>
                    <td>{property.name}</td>
                    <td>{property.address}</td>
                    <td>{property.units.length}</td>
                    <td>
                      {/* view units button */}
                      {isViewingUnits !== property.id && (
                        <button
                          type="button"
                          aria-label={`View units for ${property.name}`}
                          title="View units"
                          className="group grid h-9 w-9 place-items-center rounded-xl border border-indigo-100 bg-white text-indigo-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-md"
                          onClick={() => handleViewUnits(property.id)}
                        >
                          <svg
                            aria-hidden="true"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform group-hover:scale-110"
                          >
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="2.5" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                  {isViewingUnits === property.id && (
                    <tr>
                      <td colSpan={4}>
                        <Card>
                          <div className="p-4">
                            <h4 className="text-base flex justify-between">
                              Units for{" "}
                              {
                                properties.find((p) => p.id === property.id)
                                  ?.name
                              }
                              <div className="flex gap-4">
                                {/* add units button */}
                                <Button
                                  color="primary"
                                  className="grid h-8 place-items-center rounded-full border-0 bg-slate-100 text-slate-500 transition-colors hover:bg-rose-100 hover:text-rose-600"
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M12 5V19M5 12H19"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      stroke-linecap="round"
                                    />
                                  </svg>
                                  Add Unit
                                </Button>
                                {/* close viewing units button */}
                                <button
                                  type="button"
                                  aria-label="Close units"
                                  title="Close units"
                                  className="grid h-8 w-8 place-items-center rounded-full border-0 bg-slate-100 text-slate-500 transition-colors hover:bg-rose-100 hover:text-rose-600"
                                  onClick={() =>
                                    setIsViewingUnits((propertyId) =>
                                      propertyId === property.id
                                        ? null
                                        : propertyId,
                                    )
                                  }
                                >
                                  <svg
                                    aria-hidden="true"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                  >
                                    <path d="M6 6l12 12M18 6L6 18" />
                                  </svg>
                                </button>
                              </div>
                            </h4>
                            <Table>
                              <thead>
                                <tr>
                                  <th>Unit Number</th>
                                  <th>Monthly Rent</th>
                                  <th>Tenant</th>
                                </tr>
                              </thead>
                              <tbody>
                                {properties
                                  .find((p) => p.id === property.id)
                                  ?.units.map((unit) => (
                                    <tr key={unit.id}>
                                      <td>{unit.unitNumber}</td>
                                      <td>{money(unit.monthlyRent.toFixed(2))}</td>
                                      <td>
                                        {unit.leases.length > 0
                                          ? unit.leases[0].tenant.name
                                          : "-------"}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </Table>
                          </div>
                        </Card>
                      </td>
                    </tr>
                  )}
                </Fragment>
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
