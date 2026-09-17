"use client";

import { useState } from "react";
import { UnitViewData } from "@/app/Types/unit";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
} from "reactstrap";
import { addLease, endLease } from "@/lib/actions/leaseActions";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";

interface UnitViewProps {
  unit: UnitViewData | null;
  tenants: Array;
}
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  CardBody,
  Table,
} from "reactstrap";

export default function UnitView({ unit, tenants }: UnitViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "tenant",
      label: "Tenant",
    },
    {
      id: "lease",
      label: "Lease",
    },
    {
      id: "payments",
      label: "Payments",
    },
    {
      id: "history",
      label: "History",
    },
  ];
  const currentLease = unit?.leases.find((lease) => lease.status === "ACTIVE");

  const currentTenant = currentLease?.tenant;
  const rentCharges = currentLease?.rentCharges ?? [];
  // const payments = rentCharges.flatMap((charge) => charge.payments);
  const [terminateLeaseDialog, setModal] = useState(false);
  const toggleTerminateLeaseDialog = () => setModal(!terminateLeaseDialog);

  const [createLeaseDialog, setCreateLeaseDialog] = useState(false);
  const toggleCreateLeaseDialog = () =>
    setCreateLeaseDialog(!createLeaseDialog);
  const initialValues = {
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    terminationReason: "",
  };
  const creationInitialValues = {
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    tenantId: 0,
    monthlyRent: unit?.monthlyRent ?? 0,
    unitId: unit?.id ?? 0,
  };
  const router = useRouter();

  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <Nav tabs className="border-0 gap-1">
          {tabs.map((tab) => (
            <NavItem key={tab.id}>
              <NavLink
                href="#"
                active={activeTab === tab.id}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab.id);
                }}
                className={`
                  px-5 py-3
                  border-0
                  rounded-t-lg
                  font-medium
                  transition-colors
                  cursor-pointer
                  ${
                    activeTab === tab.id
                      ? "bg-white text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                {tab.label}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </div>

      {/* Tab Content */}
      <TabContent activeTab={activeTab} className="pt-5">
        {/* Overview */}
        <TabPane tabId="overview">
          <Card className="border-0 shadow-sm">
            <CardBody>
              <h4 className="text-xl font-semibold mb-4">Unit Overview</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Unit Number</p>
                  <p className="font-semibold">{unit?.unitNumber}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Monthly Rent</p>
                  <p className="font-semibold">KES {unit?.monthlyRent}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  {unit?.isOccupied ? (
                    <span className="inline-flex px-3 py-1 rounded-full text-sm bg-green-100">
                      <span className="text-success">Occupied</span>
                    </span>
                  ) : (
                    <span className="inline-flex px-3 py-1 rounded-full text-sm bg-red-100">
                      <span className="text-red">Vacant</span>
                    </span>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </TabPane>

        {/* Tenant */}
        <TabPane tabId="tenant">
          <Card className="border-0 shadow-sm">
            <CardBody>
              <h4 className="text-xl font-semibold mb-4">Tenant Information</h4>
              {currentTenant ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-medium">{currentTenant?.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium">{currentTenant?.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-medium">{currentTenant?.phone}</p>
                  </div>
                </div>
              ) : (
                <div>Vacant Unit</div>
              )}
            </CardBody>
          </Card>
        </TabPane>

        {/* Lease */}
        <TabPane tabId="lease">
          <Card className="border-0 shadow-sm">
            <CardBody>
              <h4 className="text-xl font-semibold mb-4">Lease Information</h4>

              {currentLease ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Start Date</p>
                    <p className="font-medium">{currentLease?.startDate}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">End Date</p>
                    <p className="font-medium">{currentLease?.endDate}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <span className="inline-flex px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                      {currentLease?.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1"></p>
                    <Button onClick={toggleTerminateLeaseDialog}>
                      Terminate Lease
                    </Button>
                  </div>

                  <Modal
                    isOpen={terminateLeaseDialog}
                    toggle={toggleTerminateLeaseDialog}
                  >
                    <ModalHeader toggle={toggleTerminateLeaseDialog}>
                      End Lease
                    </ModalHeader>
                    <Formik
                      initialValues={initialValues}
                      onSubmit={async (values) => {
                        if (!currentLease) return;

                        try {
                          const result = await endLease(
                            currentLease.id,
                            new Date(values.endDate),
                            values.terminationReason,
                          );

                          if (!result.success) {
                            console.error(result.message);
                            return;
                          }

                          // Close the modal
                          setModal(false);
                          router.refresh();
                        } catch (error) {
                          console.error("Failed to terminate lease:", error);
                        }
                      }}
                    >
                      {({ isSubmitting }) => (
                        <Form>
                          <ModalBody>
                            <div className="space-y-5">
                              {/* Warning */}
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="font-medium text-yellow-800">
                                  End this tenant's lease?
                                </p>

                                <p className="text-sm text-yellow-700 mt-1">
                                  This will mark the lease as terminated and
                                  make the unit available for a new tenant.
                                </p>
                              </div>

                              {/* Tenant */}
                              <div>
                                <h6 className="text-sm font-semibold text-gray-500 mb-3">
                                  Tenant
                                </h6>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Name
                                    </p>
                                    <p className="font-medium">
                                      {currentTenant?.name}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Unit
                                    </p>
                                    <p className="font-medium">
                                      {unit?.unitNumber}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Lease information */}
                              <div>
                                <h6 className="text-sm font-semibold text-gray-500 mb-3">
                                  Current Lease
                                </h6>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Start Date
                                    </p>

                                    <p className="font-medium">
                                      {currentLease?.startDate
                                        ? new Date(
                                            currentLease.startDate,
                                          ).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                          })
                                        : "—"}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Monthly Rent
                                    </p>

                                    <p className="font-medium">
                                      KES{" "}
                                      {currentLease?.monthlyRent.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Move-out date */}
                              <div>
                                <label className="form-label">
                                  Move-out Date{" "}
                                  <span className="text-danger">*</span>
                                </label>

                                <Field
                                  type="date"
                                  name="endDate"
                                  className="form-control"
                                  required
                                />

                                <p className="text-xs text-gray-500 mt-1">
                                  The date the tenant officially leaves the
                                  unit.
                                </p>
                              </div>

                              {/* Termination reason */}
                              <div>
                                <label className="form-label">
                                  Reason{" "}
                                  <span className="text-gray-400">
                                    (optional)
                                  </span>
                                </label>

                                <Field
                                  as="select"
                                  name="terminationReason"
                                  className="form-select"
                                >
                                  <option value="">Select a reason</option>

                                  <option value="TENANT_MOVED_OUT">
                                    Tenant moved out
                                  </option>

                                  <option value="MUTUAL_AGREEMENT">
                                    Mutual agreement
                                  </option>

                                  <option value="OTHER">Other</option>
                                </Field>
                              </div>
                            </div>
                          </ModalBody>

                          <ModalFooter>
                            <Button
                              color="secondary"
                              type="button"
                              onClick={toggleTerminateLeaseDialog}
                            >
                              Cancel
                            </Button>

                            <Button
                              color="danger"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Ending Lease..." : "End Lease"}
                            </Button>
                          </ModalFooter>
                        </Form>
                      )}
                    </Formik>
                  </Modal>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-between">
                    <div>No lease found</div>
                    <div>
                      <Button
                        onClick={toggleCreateLeaseDialog}
                        className="bg-success"
                      >
                        Add Lease
                      </Button>
                    </div>
                  </div>
                  <Modal
                    isOpen={createLeaseDialog}
                    toggle={toggleCreateLeaseDialog}
                  >
                    <ModalHeader toggle={toggleCreateLeaseDialog}>
                      Add Lease
                    </ModalHeader>
                    <Formik
                      initialValues={creationInitialValues}
                      onSubmit={async (values) => {
                        try {
                          console.log("client values", values);
                          const result = await addLease(values);

                          if (!result.success) {
                            console.error(result.message);
                            return;
                          }

                          // Close the modal
                          setCreateLeaseDialog(false);
                          router.refresh();
                        } catch (error) {
                          console.error("Failed to terminate lease:", error);
                        }
                      }}
                    >
                      {({ isSubmitting }) => (
                        <Form>
                          <ModalBody>
                            <div className="space-y-5">
                              <div>
                                {/* Unit */}
                                <div>
                                  <p className="text-xs text-gray-500">Unit</p>
                                  <p className="font-medium">
                                    {unit?.unitNumber}
                                  </p>
                                </div>

                                {/* Tenant */}
                                <div>
                                  <FormGroup>
                                    <p className="text-xs text-gray-500">
                                      Tenant
                                    </p>
                                    <Field
                                      as="select"
                                      name="tenantId"
                                      className="form-select"
                                    >
                                      <option value="">Select a tenant</option>
                                      {tenants.length > 0
                                        ? tenants.map((tenant) => (
                                            <option
                                              value={tenant.id}
                                              key={tenant.id}
                                            >
                                              {tenant.name}
                                            </option>
                                          ))
                                        : ""}
                                    </Field>
                                  </FormGroup>
                                </div>
                              </div>

                              {/* Lease information */}
                              <div>
                                <h6 className="text-sm font-semibold text-gray-500 mb-3">
                                  Current Lease
                                </h6>

                                <div>
                                  <p className="text-xs text-gray-500">
                                    Start Date
                                  </p>

                                  <Field
                                    type="date"
                                    name="startDate"
                                    className="form-control"
                                    required
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    The date the tenant officially joins the
                                    unit.
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-gray-500">
                                    Monthly Rent
                                  </p>

                                  <Field
                                    type="number"
                                    name="monthlyRent"
                                    className="form-control"
                                    required
                                  ></Field>
                                </div>
                              </div>

                              {/* Move-out date */}
                              <div>
                                <label className="form-label">
                                  Move-out Date{" "}
                                  <span className="text-danger">*</span>
                                </label>

                                <Field
                                  type="date"
                                  name="endDate"
                                  className="form-control"
                                  required
                                />

                                <p className="text-xs text-gray-500 mt-1">
                                  The date the tenant officially leaves the
                                  unit.
                                </p>
                              </div>
                            </div>
                          </ModalBody>

                          <ModalFooter>
                            <Button
                              color="secondary"
                              type="button"
                              onClick={toggleCreateLeaseDialog}
                            >
                              Cancel
                            </Button>

                            <Button
                              color="success"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {isSubmitting
                                ? "Creating Lease..."
                                : "Create Lease"}
                            </Button>
                          </ModalFooter>
                        </Form>
                      )}
                    </Formik>
                  </Modal>
                </>
              )}
            </CardBody>
          </Card>
        </TabPane>

        {/* Payments */}
        <TabPane tabId="payments">
          <Card className="border-0 shadow-sm">
            <CardBody>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-semibold mb-0">Payments</h4>
                <button className="px-4 py-2 bg-primary text-white rounded-lg">
                  Record Payment
                </button>
              </div>
              {rentCharges.length > 0 ? (
                <div className="space-y-6">
                  {rentCharges.map((charge) => (
                    <Card key={charge.id} className="border shadow-sm">
                      <CardBody>
                        {/* Rent Charge */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {charge.period}
                            </p>
                            <h5 className="font-semibold text-lg">
                              Rent Charge: KES {charge.amount.toLocaleString()}
                            </h5>
                          </div>

                          <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                            {charge.status}
                          </span>
                        </div>

                        {/* Payments */}
                        {charge.payments.length > 0 ? (
                          <div className="border-t pt-4">
                            <h6 className="font-semibold mb-3">Payments</h6>

                            <div className="space-y-3">
                              {charge.payments.map((payment) => (
                                <div
                                  key={payment.id}
                                  className="bg-gray-50 rounded-lg p-4"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Amount
                                      </p>
                                      <p className="font-medium">
                                        KES {payment.amount.toLocaleString()}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Method
                                      </p>
                                      <p className="font-medium">
                                        {payment.method}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Reference
                                      </p>
                                      <p className="font-medium">
                                        {payment.reference ?? "—"}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Date
                                      </p>
                                      <p className="font-medium">
                                        {new Date(
                                          payment.paidAt,
                                        ).toLocaleDateString("en-GB", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="border-t pt-4 text-sm text-gray-500">
                            No payments made for this rent charge.
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No rent charges yet.
                </div>
              )}
            </CardBody>
          </Card>
        </TabPane>

        {/* History */}
        <TabPane tabId="history">
          <Card className="border-0 shadow-sm">
            <CardBody>
              <div className="mb-6">
                <h4 className="text-xl font-semibold mb-1">Unit History</h4>
                <p className="text-sm text-gray-500">
                  View the tenancy and lease history for this unit.
                </p>
              </div>

              {unit && unit.leases.length > 0 ? (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gray-200" />

                  <div className="space-y-6">
                    {unit.leases.map((lease) => {
                      const isCurrent = lease.status === "ACTIVE";

                      return (
                        <div key={lease.id} className="relative flex gap-4">
                          {/* Timeline dot */}
                          <div
                            className={`relative z-10 mt-1 h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${
                              isCurrent ? "bg-green-100" : "bg-gray-100"
                            }`}
                          >
                            <div
                              className={`h-3 w-3 rounded-full ${
                                isCurrent ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                          </div>

                          {/* Lease card */}
                          <div className="flex-1 border border-gray-200 rounded-lg p-5">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-semibold text-lg">
                                    {lease.tenant.name}
                                  </h5>

                                  {isCurrent && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                      Current Tenant
                                    </span>
                                  )}
                                </div>

                                <p className="text-sm text-gray-500">
                                  {lease.tenant.email}
                                </p>

                                <p className="text-sm text-gray-500">
                                  {lease.tenant.phone}
                                </p>
                              </div>

                              <span
                                className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium ${
                                  lease.status === "ACTIVE"
                                    ? "bg-green-100 text-green-700"
                                    : lease.status === "EXPIRED"
                                      ? "bg-gray-100 text-gray-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                {lease.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5 pt-5 border-t border-gray-100">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">
                                  Lease Start
                                </p>
                                <p className="font-medium">
                                  {new Date(lease.startDate).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500 mb-1">
                                  Lease End
                                </p>
                                <p className="font-medium">
                                  {lease.endDate
                                    ? new Date(
                                        lease.endDate,
                                      ).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : "Present"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500 mb-1">
                                  Monthly Rent
                                </p>
                                <p className="font-medium">
                                  KES {lease.monthlyRent.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-xl">↺</span>
                  </div>

                  <h5 className="font-semibold text-gray-700 mb-1">
                    No history yet
                  </h5>

                  <p className="text-sm text-gray-500">
                    This unit has no tenancy history.
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </TabPane>
      </TabContent>
    </div>
  );
}
