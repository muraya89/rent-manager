import {
  Card,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  FormGroup,
  Label,
} from "reactstrap";
import { Formik, Field, Form } from "formik";
import { useState } from "react";
import BadgeComponent from "@/app/shared-components/badge";

export default function TenantForm({ className }: { className?: string }) {
  const PlainInput = ({ field, form, ...props }) => {
    return (
      <input
        {...field}
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  };
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
  const [activeTab, setActiveTab] = useState("new");
  return (
    <>
      <Card className={`${className} py-6`}>
        <div className="d-flex justify-between items-center">
          <span className="text-2xl font-bold">Tenant Information</span>

          <Nav tabs className="border-0">
            {tabs.map((tab) => (
              <NavItem key={tab.id}>
                <NavLink
                  href="#"
                  active={activeTab === tab.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab.id);
                  }}
                  className={`cursor-pointer rounded-t-lg border-0 px-4 py-3 text-sm transition  ${
                    activeTab === tab.id
                      ? "bg-sidebar !rounded-4xl text-white"
                      : "!text-gray-500 !hover:bg-gray-50 !hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </div>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="new">
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

            <div className="d-flex gap-3">
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
          </TabPane>

          <TabPane tabId="existing">
            <FormGroup>
              <Label for="tenant">Tenant</Label>
              <Field
                id="tenant"
                component={PlainInput}
                name="tenant"
                type="text"
                required
                placeholder="e.g., Jane Doe, John Doe"
              ></Field>
            </FormGroup>

            <div className="d-flex gap-3 px-4 w-100">
              <div className="d-flex">
                <div
                  className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-(--primary) bg-(--primary-light)`}
                >
                  {/* {tenant?.initials} */}
                </div>

                <div className="d-flex flex-col">
                  <p className="font-bold text-slate-700 mb-0">
                    Carol
                  </p>

                  <div>
                    <span className="text-slate-700 mb-0">tenant@mail.com</span>
                    <span className="text-slate-700 mb-0">071234567</span>
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
          </TabPane>
        </TabContent>
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
        <span className="text-2xl font-bold mb-4">Lease Information</span>
        {/* TO DO lease start date and end date */}
      </Card>
    </>
  );
}
