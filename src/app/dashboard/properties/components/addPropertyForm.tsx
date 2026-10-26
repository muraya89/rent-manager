"use client";

import Link from "next/link";
import { Formik, Field, Form } from "formik";
import { FormGroup, Label, Card } from "reactstrap";
import { PropertyFormValues } from "@/app/Types/property";
import { createProperty } from "@/lib/actions/propertyActions";
import PlainInput from "@/app/shared-components/plainInput";
import SectionTitle from "@/app/shared-components/sectionTitle";
import ImagePicker from "@/app/shared-components/imagePicker";

export default function addTenantForm() {
  const initialValues: PropertyFormValues = {
    name: "",
    address: "",
    monthlyRent: 0,
    image: null as File | null,
  };

  return (
    <>
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, helpers) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("address", values.address);
            formData.append("monthlyRent", String(values.monthlyRent));
            if (values.image) formData.append("image", values.image);

            // On success the action redirects, so this only returns when something went wrong
            const res = await createProperty(formData);
            if (res && !res.ok) helpers.setStatus(res.error);
          }}
        >
          {({ values, setFieldValue, status }) => (
            <Form className="mt-4 numbered-form">
              {status && <div className="alert alert-danger">{status}</div>}
              <Card className="px-4 py-6 mb-4">
                <SectionTitle title="Property Details" />

                <div className="d-flex gap-4">
                  <FormGroup className="w-full">
                    <Label for="name" className="font-semibold">
                      Property Name
                    </Label>
                    <Field
                      id="name"
                      component={PlainInput}
                      name="name"
                      type="text"
                      required
                      placeholder="e.g., RentWise Heights"
                    ></Field>
                  </FormGroup>

                  <FormGroup className="w-full">
                    <Label for="address" className="font-semibold">
                      Address
                    </Label>
                    <Field
                      id="address"
                      component={PlainInput}
                      name="address"
                      type="text"
                      required
                      placeholder=""
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
                      type="number"
                      required
                      placeholder=""
                    ></Field>
                  </FormGroup>
                </div>
              </Card>

              <Card className="px-4 py-6 mb-4">
                <SectionTitle title="Cover Image" />

                <div className="d-flex gap-4">
                  <FormGroup>
                    <ImagePicker
                      onChange={(file) => setFieldValue("image", file)}
                    />
                  </FormGroup>
                </div>
              </Card>
              {/* <FormGroup>
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
            </FormGroup> */}
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
          )}
        </Formik>
      </div>
    </>
  );
}
