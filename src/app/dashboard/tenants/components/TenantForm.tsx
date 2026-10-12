import {
  Breadcrumb,
  BreadcrumbItem,
  FormGroup,
  Label,
} from "reactstrap";
import { Formik, Field, Form } from "formik";

export default function TenantForm() {
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
      <div className="px-4 py-6">
        <h5 className="text-2xl font-semibold mb-4">Tenant Information</h5>

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
    </>
  );
}
