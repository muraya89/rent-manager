"use client";

import Link from "next/link";
import { Formik, Field, Form } from "formik";
import { createTenant } from "@/lib/actions/tenantActions";
import { TenantFormValues } from "@/app/Types/tenant";
import TenantForm from "./TenantForm";

export default function addTenantForm() {
  const initialValues: TenantFormValues = {
    tenant: {
      name: "",
      email: "",
      phone: "",
    },
    tenantId: 0,
    unitId: 0,
    propertyId: 0,
    lease: {
      startDate: "",
      endDate: "",
      monthlyRent: 0,
      depositAmount: 0,
      rentDueDay: 1,
      occupants: 1,
    },
    isOccupied: false,
    tenantMode: "new",
  };

  return (
    <>
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            await createTenant(values);
          }}
        >
          <Form className="numbered-form">
            <TenantForm className="px-6" context="tenant" />

            <div className="mt-5 flex justify-end gap-4 pt-3">
              <Link href={`/dashboard/tenants`}>
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
                Save Tenant
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </>
  );
}
