"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Card, CardBody, Col, FormGroup, Label, Row } from "reactstrap";
import { useRouter } from "next/navigation";
import { updateTenant } from "@/lib/actions/tenantActions";

interface Tenant {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;

  leases: Array<{
    id: number;
    monthlyRent: number;
    status: string;

    unit: {
      unitNumber: string;

      property: {
        id: number;
        name: string;
      };
    };
  }>;
}

interface EditTenantFormProps {
  tenant: Tenant;
}

export default function EditTenantForm({ tenant }: EditTenantFormProps) {
  const router = useRouter();

  const activeLease = tenant.leases[0];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => router.push(`/dashboard/tenants/${tenant.id}`)}
          className="mb-5 border-0 bg-transparent p-0 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back to Tenant
        </button>

        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Edit Tenant
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update the tenant's personal and contact information.
          </p>
        </div>

        <Row className="g-4">
          {/* Form */}
          <Col lg="8">
            <Card className="border-0 shadow-sm">
              <CardBody className="p-4 p-md-5">
                {/* Tenant identity */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700">
                    {getInitials(tenant.name)}
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      {tenant.name}
                    </h2>

                    <p className="text-sm text-slate-500">
                      Tenant #{tenant.id}
                    </p>
                  </div>
                </div>

                <div className="mb-5 border-t border-slate-100 pt-5">
                  <h3 className="text-base font-semibold text-slate-900">
                    Tenant information
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Keep the tenant's contact details up to date.
                  </p>
                </div>

                <Formik
                  initialValues={{
                    name: tenant.name ?? "",
                    email: tenant.email ?? "",
                    phone: tenant.phone ?? "",
                  }}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      await updateTenant({
                        id: tenant.id,
                        name: values.name,
                        email: values.email,
                        phone: values.phone,
                      });

                      router.push(`/dashboard/tenants/${tenant.id}`);

                      router.refresh();
                    } catch (error) {
                      console.error("Failed to update tenant:", error);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <Row className="g-4">
                        {/* Name */}
                        <Col md="12">
                          <FormGroup>
                            <Label
                              for="name"
                              className="mb-2 text-sm font-medium text-slate-700"
                            >
                              Full name
                            </Label>

                            <Field
                              id="name"
                              name="name"
                              type="text"
                              className="form-control rounded-xl border-slate-200 px-3 py-2.5 shadow-none"
                              placeholder="Enter full name"
                            />

                            <ErrorMessage
                              name="name"
                              component="div"
                              className="mt-1 text-sm text-red-500"
                            />
                          </FormGroup>
                        </Col>

                        {/* Email */}
                        <Col md="6">
                          <FormGroup>
                            <Label
                              for="email"
                              className="mb-2 text-sm font-medium text-slate-700"
                            >
                              Email address
                            </Label>

                            <Field
                              id="email"
                              name="email"
                              type="email"
                              className="form-control rounded-xl border-slate-200 px-3 py-2.5 shadow-none"
                              placeholder="tenant@example.com"
                            />

                            <ErrorMessage
                              name="email"
                              component="div"
                              className="mt-1 text-sm text-red-500"
                            />
                          </FormGroup>
                        </Col>

                        {/* Phone */}
                        <Col md="6">
                          <FormGroup>
                            <Label
                              for="phone"
                              className="mb-2 text-sm font-medium text-slate-700"
                            >
                              Phone number
                            </Label>

                            <Field
                              id="phone"
                              name="phone"
                              type="tel"
                              className="form-control rounded-xl border-slate-200 px-3 py-2.5 shadow-none"
                              placeholder="07XX XXX XXX"
                            />

                            <ErrorMessage
                              name="phone"
                              component="div"
                              className="mt-1 text-sm text-red-500"
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      {/* Actions */}
                      <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
                        <Button
                          type="button"
                          color="light"
                          onClick={() =>
                            router.push(`/dashboard/tenants/${tenant.id}`)
                          }
                          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 shadow-none"
                        >
                          Cancel
                        </Button>

                        <Button
                          type="submit"
                          color="primary"
                          disabled={isSubmitting}
                          className="rounded-xl border-0 bg-indigo-600 px-5 py-2.5 shadow-none"
                        >
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Col>

          {/* Current tenancy */}
          <Col lg="4">
            <Card className="border-0 shadow-sm">
              <CardBody className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Current tenancy
                </p>

                {activeLease ? (
                  <div className="mt-5 space-y-5">
                    <Detail
                      label="Property"
                      value={activeLease.unit.property.name}
                    />

                    <Detail
                      label="Unit"
                      value={`Unit ${activeLease.unit.unitNumber}`}
                    />

                    <Detail
                      label="Monthly rent"
                      value={formatCurrency(Number(activeLease.monthlyRent))}
                    />

                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Lease status
                      </p>

                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Active
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700">
                      No active lease
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      This tenant is currently not assigned to a unit.
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Information */}
            <Card className="mt-4 border border-indigo-100 bg-indigo-50 shadow-none">
              <CardBody className="p-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-semibold text-indigo-600">
                    i
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      About editing
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Changes here only affect the tenant's personal
                      information. Lease and payment details are managed
                      separately.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

/* ----------------------------- */
/* Small components */
/* ----------------------------- */

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatCurrency(value: number) {
  return `KES ${value.toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
