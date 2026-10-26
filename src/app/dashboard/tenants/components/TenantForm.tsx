"use client";
import { Card, Nav, NavItem, NavLink, FormGroup, Label } from "reactstrap";
import { Field, useFormikContext } from "formik";
import { useState, useEffect } from "react";
import BadgeComponent from "@/app/shared-components/badge";
import { Tenant, TenantMode } from "@/app/Types/tenant";
import { getNotLeasedTenant } from "@/lib/queries/tenantQueries";
import PlainInput from "@/app/shared-components/plainInput";
import SectionTitle from "@/app/shared-components/sectionTitle";

type TenantFormContext = "unit" | "tenant";
type FormValues = {
  tenantMode: TenantMode;
  tenantId: string | null;
  tenant: { name: string; email: string; phone: string };
};
export default function TenantForm({
  className,
  context = "unit",
}: {
  className?: string;
  context?: TenantFormContext;
}) {
  const inUnitForm = context === "unit";

  // Unit page: Unit Details is already 1, so we start at 2
  const tabs = [
    {
      id: "new",
      label: "New Tenant",
    },
    {
      id: "existing",
      label: "Existing Tenant",
    },
  ];
  const { values, setFieldValue, errors, touched } =
    useFormikContext<FormValues>();
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState<Tenant[]>([]);
  useEffect(() => {
    if (values.tenantMode !== "existing" || available.length) return;
    setLoading(true);
    getNotLeasedTenant()
      .then(setAvailable)
      .finally(() => setLoading(false));
  }, [values.tenantMode, available.length]);
  const selected = available.find((t) => String(t.id) === values.tenantId);
  const switchMode = (mode: TenantMode) => {
    if (mode === values.tenantMode) return;
    setFieldValue("tenantMode", mode);
    // clear the other mode's data so it can never be submitted by accident
    if (mode === "new") setFieldValue("tenantId", "");
    else setFieldValue("tenant", { name: "", email: "", phone: "" });
  };
  return (
    <>
      <Card className={`${className} py-6`}>
        <div className="d-flex justify-between items-center">
          <SectionTitle title="Tenant Information" />

          {inUnitForm && (
            <>
              <Nav tabs className="border-0">
                {tabs.map((tab) => (
                  <NavItem key={tab.id}>
                    <NavLink
                      href="#"
                      active={values.tenantMode === tab.id}
                      onClick={(e) => {
                        e.preventDefault();
                        switchMode(tab.id);
                      }}
                      className={`cursor-pointer rounded-t-lg border-0 px-4 py-3 text-sm transition  ${
                        values.tenantMode === tab.id
                          ? "bg-sidebar !rounded-4xl text-white"
                          : "!text-gray-500 !hover:bg-gray-50 !hover:text-gray-800"
                      }`}
                    >
                      {tab.label}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
            </>
          )}
        </div>

        {values.tenantMode == "new" ? (
          <>
            <FormGroup>
              <Label for="tenant.name">Name</Label>
              <Field
                id="tenant.name"
                component={PlainInput}
                name="tenant.name"
                type="text"
                required
                placeholder="e.g., Jane Doe, John Doe"
              ></Field>
            </FormGroup>

            <div className="d-flex gap-3">
              <FormGroup>
                <Label for="tenant.email">Email</Label>
                <Field
                  id="tenant.email"
                  component={PlainInput}
                  name="tenant.email"
                  type="text"
                  required
                  placeholder="e.g., example@gmail.com"
                ></Field>
              </FormGroup>

              <FormGroup>
                <Label for="tenant.phone">Phone Number</Label>
                <Field
                  id="tenant.phone"
                  component={PlainInput}
                  name="tenant.phone"
                  type="text"
                  required
                  placeholder="e.g., +254712345678"
                ></Field>
              </FormGroup>
            </div>
          </>
        ) : (
          <>
            <FormGroup>
              <Label for="tenantId" className="font-bold">
                Tenant
              </Label>
              <Field
                as="select"
                id="tenantId"
                name="tenantId"
                className="form-select"
              >
                <option value="">Select a tenant…</option>
                {available.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} · {t.phone}
                  </option>
                ))}
              </Field>
              {touched.tenantId && errors.tenantId && (
                <div className="text-danger small mt-1">{errors.tenantId}</div>
              )}
            </FormGroup>

            {selected && (
              <div className="d-flex justify-between items-center px-4 py-2 w-100 bg-(--background) border-2 rounded-xl">
                <div className="d-flex gap-3 items-center">
                  <div
                    className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-(--primary) bg-(--primary-light)`}
                  >
                    {/* {tenant?.initials} */}
                  </div>

                  <div className="d-flex flex-col">
                    <p className="font-bold text-slate-700 mb-0">
                      {selected.name}
                    </p>

                    <div>
                      <span className="text-slate-700 mb-0">
                        {selected.email}
                        </span>
                        &nbsp;
                        :
                        &nbsp;
                      <span className="text-slate-700 mb-0">
                        {selected.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <BadgeComponent
                    pill
                    textColor="text-primary"
                    bgColor="bg-(--primary-light)"
                    caption="No lease yet"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* <Card className={`${className} py-6 my-4`}>
        <span className="text-2xl font-bold mb-4">Personal Details</span> */}
      {/* TO DO  KRA pin, nationality */}
      {/* </Card> */}

      {/* <Card className={`${className} py-6 my-4`}>
        <span className="text-2xl font-bold mb-4">Occupancy Details</span> */}
      {/* TO DO property, unit,  place of wrk, occupation number of occupants */}
      {/* </Card> */}

      <Card className={`${className} py-6 my-4`}>
        <SectionTitle title="Lease Information" className="mb-3" />
        <div className="d-flex gap-4">
          <FormGroup className="w-full">
            <Label for="lease.startDate">Lease Start</Label>
            <Field
              id="lease.startDate"
              component={PlainInput}
              name="lease.startDate"
              type="date"
              required
            ></Field>
          </FormGroup>

          <FormGroup className="w-full">
            <Label for="lease.endDate">Lease End</Label>
            <Field
              id="lease.endDate"
              component={PlainInput}
              name="lease.endDate"
              type="date"
            ></Field>
          </FormGroup>

          <FormGroup className="w-full">
            <Label for="lease.monthlyRent">Monthly Rent (KES)</Label>
            <Field
              id="lease.monthlyRent"
              component={PlainInput}
              name="lease.monthlyRent"
              type="number"
              required
            ></Field>
          </FormGroup>
        </div>
      </Card>
    </>
  );
}
