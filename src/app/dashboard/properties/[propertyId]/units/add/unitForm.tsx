"use client";

import { Breadcrumb, BreadcrumbItem, Card, Label, FormGroup } from "reactstrap";
import Link from "next/link";
import { Form, Formik, Field } from "formik";
import { createUnit } from "@/lib/actions/unitActions";
import { UnitFormValues } from "@/app/Types/unit";
import TenantForm from "@/app/dashboard/tenants/components/TenantForm";
import SectionTitle from "@/app/shared-components/sectionTitle";
import PlainInput from "@/app/shared-components/plainInput";
import OccupiedSwitch from "@/app/shared-components/switch";

interface AddUnitFormProps {
  propertyId: number;
  propertyName: string;
}

export default function addUnitForm({
  propertyId,
  propertyName,
}: AddUnitFormProps) {
  const emptyTenant = { name: "", email: "", phone: "" };
  const emptyLease = {
    startDate: "",
    endDate: "",
    monthlyRent: 0,
    rentDueDay: 1,
    occupants: 1,
    depositAmount: 0,
  };
  const initialValues: UnitFormValues = {
    unitNumber: "",
    monthlyRent: 0,
    isOccupied: false,
    tenant: emptyTenant,
    tenantId: "",
    lease: emptyLease,
    tenantMode: "new",
    defaultDeposit: 0
  };
  return (
    <div className="px-4">
      <Breadcrumb className="px-4">
        <BreadcrumbItem>
          <Link href="/dashboard/properties" className="no-underline">
            Properties
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>{propertyName}</BreadcrumbItem>
        <BreadcrumbItem active>Add Unit</BreadcrumbItem>
      </Breadcrumb>

      <hr />

      <Card className="rounded-lg mb-4">
        <div className="bg-secondary px-4 py-5 sm:px-10 sm:py-12 rounded-lg">
          <h3 className="tracking-tight sm:text-4xl text-white">
            Add Unit to {propertyName}
          </h3>
        </div>
      </Card>

      <Formik
        initialValues={initialValues}
        onSubmit={(values) =>
          createUnit(propertyId, {
            ...values,
            monthlyRent: Number(values.monthlyRent),
          })
        }
      >
        {({ values, setFieldValue }) => (
          <Form className="mt-4 numbered-form">
            <Card className="px-4 py-6 mb-4">
              <SectionTitle title="Unit Details" />

              <div className="d-flex justify-between gap-4">
                <FormGroup className="w-full">
                  <Label for="unitNumber" className="font-semibold">
                    Unit Number
                  </Label>
                  <Field
                    id="unitNumber"
                    component={PlainInput}
                    name="unitNumber"
                    type="text"
                    required
                    placeholder="e.g., A101, B205"
                  ></Field>
                </FormGroup>

                <FormGroup className="w-full">
                  <Label for="monthlyRent" className="font-semibold">
                    Monthly Rent
                  </Label>
                  <Field
                    id="monthlyRent"
                    component={PlainInput}
                    name="monthlyRent"
                    placeholder="e.g., 15000"
                    type="number"
                    required
                  ></Field>
                </FormGroup>
              </div>

              <OccupiedSwitch
                id="isOccupied"
                checked={values.isOccupied}
                onChange={(checked) => {
                  setFieldValue("isOccupied", checked);
                  if (!checked) {
                    // clear stale tenant data when switched off
                    setFieldValue("tenantMode", "new");
                    setFieldValue("tenantId", "");
                    setFieldValue("tenant", emptyTenant);
                    setFieldValue("lease", emptyLease);
                  }
                }}
              />
            </Card>

            <div>
              {/* TENANT FORM */}
              {values.isOccupied && (
                <TenantForm
                  className="px-4"
                  context="unit"
                  propertyId={propertyId}
                />
              )}

              <div className="mt-5 flex justify-end gap-4">
                <Link href={`/dashboard/properties/${propertyId}`}>
                  <button
                    type="button"
                    className="px-4 py-2 border  text-gray-700 rounded-pill hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </Link>

                <button
                  type="submit"
                  className="px-4 py-2 bg-primary rounded-pill text-white hover:bg-blue-700"
                >
                  Save Unit
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
