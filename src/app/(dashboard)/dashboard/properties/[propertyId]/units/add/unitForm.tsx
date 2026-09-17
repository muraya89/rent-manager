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
import { UnitFormValues } from "@/app/Types/unit";
import TenantForm from "@/app/(dashboard)/dashboard/tenants/components/TenantForm";

interface AddUnitFormProps {
  propertyId: number;
  propertyName: string;
}

export default function addUnitForm({
  propertyId,
  propertyName,
}: AddUnitFormProps) {
  const initialValues: UnitFormValues = {
    unitNumber: "",
    monthlyRent: 0,
    isOccupied: false,

    name: "",
    email: "",
    phone: "",
  };
  const PlainInput = ({ field, form, ...props }) => {
    return (
      <input
        {...field}
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
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

      <Card className="border border-gray-200 rounded-lg bg-white">
        <div className="bg-secondary px-4 py-5 sm:px-10 sm:py-12 rounded-t-lg">
          <h3 className="tracking-tight sm:text-4xl">
            Add Unit to {propertyName}
          </h3>
        </div>
        <div className="px-4 py-6">
          <h5 className="text-2xl font-semibold mb-4">Unit Details</h5>

          <hr />

          <Formik
            initialValues={initialValues}
            onSubmit={(values) =>
              createUnit(propertyId, {
                ...values,
                monthlyRent: Number(values.monthlyRent),
              })
            }
          >{({ values, setFieldValue }) => (
            <Form className="mt-4">
              <FormGroup>
                <Label for="unitNumber">Unit Number</Label>
                <Field
                  id="unitNumber"
                  component={PlainInput}
                  name="unitNumber"
                  type="text"
                  required
                  placeholder="e.g., A101, B205"
                ></Field>
              </FormGroup>

              <FormGroup>
                <Label for="monthlyRent">Monthly Rent</Label>
                <Field
                  id="monthlyRent"
                  component={PlainInput}
                  name="monthlyRent"
                  placeholder="e.g., 15000"
                  type="number"
                  required
                ></Field>
              </FormGroup>

              <FormGroup switch>
                <Input
                  type="switch"
                  checked={values.isOccupied}
                  onChange={(e) =>
                    setFieldValue("isOccupied", e.target.checked)
                  }
                />

                <Label check>Is Occupied</Label>
              </FormGroup>

              {values.isOccupied && <TenantForm /> }

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
            </Form>
          )}
          </Formik>
        </div>
      </Card>
    </div>
  );
}
