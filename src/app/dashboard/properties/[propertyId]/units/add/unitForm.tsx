"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Label,
  FormGroup,
  Input,
} from "reactstrap";
import Link from "next/link";
import { Form, Formik, Field } from "formik";
import { createUnit } from "@/lib/actions/unitActions";
import { UnitFormValues, OccupiedSwitchProps } from "@/app/Types/unit";
import TenantForm from "@/app/dashboard/tenants/components/TenantForm";
import SectionTitle from "@/app/shared-components/sectionTitle";
import PlainInput from "@/app/shared-components/plainInput";

interface AddUnitFormProps {
  propertyId: number;
  propertyName: string;
}

export function OccupiedSwitch({
  id = "isOccupied",
  checked,
  onChange,
  title = "This unit is occupied",
  description = "Turn on to add the tenant and lease now. You can also do this later.",
}: OccupiedSwitchProps) {
  return (
    <div className="occupied-switch">
      <FormGroup switch className="m-0">
        <Input
          id={id}
          type="switch"
          role="switch"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </FormGroup>

      <Label for={id} className="d-flex flex-col">
        <strong>{title}</strong>
        <span>{description}</span>
      </Label>
    </div>
  );
}

export default function addUnitForm({
  propertyId,
  propertyName,
}: AddUnitFormProps) {
  const emptyTenant = { name: "", email: "", phone: "" };
  const emptyLease = { startDate: "", monthlyRent: 0, endDate: "" };
  const initialValues: UnitFormValues = {
    unitNumber: "",
    monthlyRent: 0,
    isOccupied: true,
    tenant: emptyTenant,
    tenantId: null,
    lease: emptyLease,
    tenantMode: "new",
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
                checked={values.isOccupied}
                onChange={(checked) => {
                  setFieldValue("isOccupied", checked);
                  if (!checked) {
                    // clear stale tenant data when switched off
                    setFieldValue("tenantMode", "new");
                    setFieldValue("tenantId", null);
                    setFieldValue("tenant", emptyTenant);
                    setFieldValue("lease", emptyLease);
                  }
                }}
              />
            </Card>

            <div>
              {/* TENANT FORM */}
              {values.isOccupied && (
                <TenantForm className="px-4" context="unit" />
              )}

              <div className="mt-5 flex justify-end gap-4 border-t border-t-gray-200 pt-3">
                <Link href={`/dashboard/properties/${propertyId}`}>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </Link>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
