"use client";

import Link from "next/link";
import { Formik, Field, Form } from "formik";
import { createTenant } from "@/lib/actions/tenantActions";
import { TenantFormValues } from "@/app/Types/tenant";
import TenantForm from "./TenantForm";

export default function addTenantForm() {
  const initialValues: TenantFormValues = {
    name: "",
    email: "",
    phone: "",
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
          <Form>
           
            <TenantForm/>

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
