"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormGroup,
  Label,
  Card,
  CardBody,
} from "reactstrap";
import Link from "next/link";
import { Formik, Field } from "formik";
import { createTenant } from "@/lib/actions/tenantActions";
import { TenantFormValues } from "@/app/Types/tenant";

export default function addTenantForm() {
  const initialValues: TenantFormValues = {
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
    <>
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => createTenant(values)}
        >
          <Form>
            <div className="px-4 py-6">
              <h5 className="text-2xl font-semibold mb-4">
                Tenant Information
              </h5>

              <hr />
              <FormGroup>
                <Label for="name">Name</Label>
                <Field
                  id="name"
                  component={PlainInput}
                  name="name"
                  type="text"
                  required
                  placeholder="e.g., Jane Doe, John Doe"
                ></Field>
              </FormGroup>

              <FormGroup>
                <Label for="email">Email</Label>
                <Field
                  id="email"
                  component={PlainInput}
                  name="email"
                  type="text"
                  required
                  placeholder="e.g., example@gmail.com"
                ></Field>
              </FormGroup>

              <FormGroup>
                <Label for="phone">Phone Number</Label>
                <Field
                  id="phone"
                  component={PlainInput}
                  name="phone"
                  type="text"
                  required
                  placeholder="e.g., +254712345678"
                ></Field>
              </FormGroup>
            </div>

            <div className="px-4 py-6">
              <h5 className="text-2xl font-semibold mb-4">Personal Details</h5>
              {/* TO DO  KRA pin, nationality */}
              <hr />
            </div>

            <div className="px-4 py-6">
              <h5 className="text-2xl font-semibold mb-4">Occupancy Details</h5>
              {/* TO DO property, unit,  place of wrk, occupation number of occupants */}
              <hr />
            </div>

            <div className="px-4 py-6">
              <h5 className="text-2xl font-semibold mb-4">Lease Information</h5>
              {/* TO DO lease start date and end date */}
              <hr />
            </div>

            <div className="mt-5 flex justify-end gap-4 border-t border-t-gray-200 pt-3">
              <Link href={`/dashboard/tenants`}>
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
                Save Tenant
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </>
  );
}
