"use client";

import { useState } from "react";
import { UnitViewData } from "@/app/Types/unit";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import { addLease, endLease } from "@/lib/actions/leaseActions";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";

interface TenantOption {
  id: number;
  name: string;
}

interface UnitViewProps {
  unit: UnitViewData | null;
  tenants: TenantOption[];
}

export default function UnitView({ unit, tenants }: UnitViewProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [terminateLeaseDialog, setTerminateLeaseDialog] = useState(false);
  const [createLeaseDialog, setCreateLeaseDialog] = useState(false);

  if (!unit) {
    return (
      <div className="py-5 text-center">
        <Card className="border-0 shadow-sm">
          <CardBody className="py-5">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <span className="text-xl text-gray-400">?</span>
            </div>

            <h5 className="font-semibold text-gray-700">Unit not found</h5>

            <p className="mt-1 text-sm text-gray-500">
              The unit you are looking for could not be found.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const currentLease = unit.leases.find((lease) => lease.status === "ACTIVE");

  const currentTenant = currentLease?.tenant;
  const rentCharges = currentLease?.rentCharges ?? [];

  const totalPaid = rentCharges.reduce(
    (total, charge) =>
      total +
      charge.payments.reduce(
        (paymentTotal, payment) => paymentTotal + Number(payment.amount),
        0,
      ),
    0,
  );

  const totalCharges = rentCharges.reduce(
    (total, charge) => total + Number(charge.amount),
    0,
  );

  const outstanding = Math.max(totalCharges - totalPaid, 0);

  const occupancyStatus = unit.isOccupied ? "Occupied" : "Vacant";

  const formattedRent = Number(unit.monthlyRent).toLocaleString();

  const leaseEndDate = currentLease?.endDate
    ? formatDate(currentLease.endDate)
    : "Open ended";

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

  const terminateInitialValues = {
    endDate: new Date().toISOString().split("T")[0],
    terminationReason: "",
  };

  const creationInitialValues = {
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    tenantId: 0,
    monthlyRent: Number(unit.monthlyRent),
    unitId: unit.id,
  };

  const toggleTerminateLeaseDialog = () =>
    setTerminateLeaseDialog(!terminateLeaseDialog);

  const toggleCreateLeaseDialog = () =>
    setCreateLeaseDialog(!createLeaseDialog);

  return (
    <div className="mt-4 px-4 pb-5">
      {/* Back */}
      <button
        type="button"
        onClick={() => router.push("/dashboard/properties")}
        className="mb-4 flex items-center gap-2 border-0 bg-transparent p-0 text-sm text-gray-500 transition hover:text-gray-900"
      >
        <span>←</span>
        <span>Back to properties</span>
      </button>

      {/* Unit Header */}
      <Card className="mb-4 overflow-hidden border-0 shadow-sm">
        <CardBody className="p-0">
          <div className="p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <h2 className="mb-0 text-2xl font-semibold text-gray-900">
                    Unit {unit.unitNumber}
                  </h2>

                  <StatusBadge
                    status={unit.isOccupied ? "OCCUPIED" : "VACANT"}
                  />
                </div>

                <p className="mb-1 text-sm text-gray-500">
                  Unit details and tenancy information
                </p>

                {currentTenant ? (
                  <p className="mb-0 text-sm text-gray-700">
                    Current tenant:{" "}
                    <span className="font-semibold">{currentTenant.name}</span>
                  </p>
                ) : (
                  <p className="mb-0 text-sm text-gray-500">
                    No tenant currently assigned
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {currentLease && (
                  <Button
                    color="primary"
                    className="rounded-lg px-4"
                    onClick={() => setActiveTab("payments")}
                  >
                    Record Payment
                  </Button>
                )}

                {!currentLease && (
                  <Button
                    color="success"
                    className="rounded-lg px-4"
                    onClick={toggleCreateLeaseDialog}
                  >
                    Add Lease
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Header stats */}
          <div className="border-top bg-gray-50 px-5 py-4">
            <Row className="g-4">
              <Col xs="6" md="3">
                <HeaderStat
                  label="Monthly Rent"
                  value={`KES ${formattedRent}`}
                />
              </Col>

              <Col xs="6" md="3">
                <HeaderStat
                  label="Tenant"
                  value={currentTenant?.name ?? "Vacant"}
                />
              </Col>

              <Col xs="6" md="3">
                <HeaderStat label="Lease Ends" value={leaseEndDate} />
              </Col>

              <Col xs="6" md="3">
                <HeaderStat
                  label="Outstanding"
                  value={`KES ${outstanding.toLocaleString()}`}
                  valueClass={outstanding > 0 ? "text-danger" : "text-success"}
                />
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <div className="mb-4 rounded-xl border border-gray-200 bg-white shadow-sm">
        <Nav tabs className="border-0 px-2 pt-2">
          {tabs.map((tab) => (
            <NavItem key={tab.id}>
              <NavLink
                href="#"
                active={activeTab === tab.id}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab.id);
                }}
                className={`cursor-pointer rounded-t-lg border-0 px-4 py-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-primary bg-white text-primary"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                {tab.label}

                {tab.id === "payments" && currentLease && (
                  <span className="ms-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                    {rentCharges.length}
                  </span>
                )}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </div>

      <TabContent activeTab={activeTab}>
        {/* ===================================================== */}
        {/* OVERVIEW */}
        {/* ===================================================== */}

        <TabPane tabId="overview">
          <div className="space-y-4">
            <Row className="g-4">
              <Col md="4">
                <InfoCard label="Unit" value={unit.unitNumber} icon="▦" />
              </Col>

              <Col md="4">
                <InfoCard
                  label="Monthly Rent"
                  value={`KES ${formattedRent}`}
                  icon="K"
                />
              </Col>

              <Col md="4">
                <InfoCard
                  label="Occupancy"
                  value={unit.isOccupied ? "Occupied" : "Vacant"}
                  icon={unit.isOccupied ? "✓" : "○"}
                  valueClass={unit.isOccupied ? "text-success" : "text-warning"}
                />
              </Col>
            </Row>

            <Card className="border-0 shadow-sm">
              <CardBody className="p-5">
                <div className="mb-4">
                  <h4 className="mb-1 text-lg font-semibold">
                    Current tenancy
                  </h4>

                  <p className="mb-0 text-sm text-gray-500">
                    Overview of the current tenant and lease.
                  </p>
                </div>

                {currentLease && currentTenant ? (
                  <Row className="g-4">
                    <Col md="3">
                      <Detail label="Tenant" value={currentTenant.name} />
                    </Col>

                    <Col md="3">
                      <Detail
                        label="Lease Start"
                        value={formatDate(currentLease.startDate)}
                      />
                    </Col>

                    <Col md="3">
                      <Detail label="Lease End" value={leaseEndDate} />
                    </Col>

                    <Col md="3">
                      <Detail
                        label="Monthly Rent"
                        value={`KES ${Number(
                          currentLease.monthlyRent,
                        ).toLocaleString()}`}
                      />
                    </Col>
                  </Row>
                ) : (
                  <VacantState onAddLease={toggleCreateLeaseDialog} />
                )}
              </CardBody>
            </Card>

            {/* Payment summary */}
            {currentLease && (
              <Card className="border-0 shadow-sm">
                <CardBody className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="mb-1 text-lg font-semibold">
                        Payment summary
                      </h4>

                      <p className="mb-0 text-sm text-gray-500">
                        Current lease payment activity
                      </p>
                    </div>

                    <Button
                      color="link"
                      className="text-decoration-none"
                      onClick={() => setActiveTab("payments")}
                    >
                      View payments →
                    </Button>
                  </div>

                  <Row className="g-3">
                    <Col md="4">
                      <FinancialStat
                        label="Rent Charges"
                        amount={totalCharges}
                      />
                    </Col>

                    <Col md="4">
                      <FinancialStat
                        label="Paid"
                        amount={totalPaid}
                        type="success"
                      />
                    </Col>

                    <Col md="4">
                      <FinancialStat
                        label="Outstanding"
                        amount={outstanding}
                        type={outstanding > 0 ? "danger" : "success"}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            )}
          </div>
        </TabPane>

        {/* ===================================================== */}
        {/* TENANT */}
        {/* ===================================================== */}

        <TabPane tabId="tenant">
          <Card className="border-0 shadow-sm">
            <CardBody className="p-5">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h4 className="mb-1 text-lg font-semibold">
                    Tenant information
                  </h4>

                  <p className="mb-0 text-sm text-gray-500">
                    Information about the current occupant.
                  </p>
                </div>

                {currentTenant && <StatusBadge status="ACTIVE" />}
              </div>

              {currentTenant ? (
                <div>
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-600">
                      {getInitials(currentTenant.name)}
                    </div>

                    <div>
                      <h5 className="mb-1 font-semibold">
                        {currentTenant.name}
                      </h5>

                      <p className="mb-0 text-sm text-gray-500">
                        Current tenant
                      </p>
                    </div>
                  </div>

                  <Row className="g-4">
                    <Col md="4">
                      <Detail label="Full Name" value={currentTenant.name} />
                    </Col>

                    <Col md="4">
                      <Detail
                        label="Email"
                        value={currentTenant.email || "—"}
                      />
                    </Col>

                    <Col md="4">
                      <Detail
                        label="Phone"
                        value={currentTenant.phone || "—"}
                      />
                    </Col>
                  </Row>

                  <div className="mt-5 border-top pt-5">
                    <h6 className="mb-4 font-semibold">Lease details</h6>

                    <Row className="g-4">
                      <Col md="4">
                        <Detail
                          label="Lease Start"
                          value={formatDate(currentLease?.startDate)}
                        />
                      </Col>

                      <Col md="4">
                        <Detail label="Lease End" value={leaseEndDate} />
                      </Col>

                      <Col md="4">
                        <Detail
                          label="Monthly Rent"
                          value={`KES ${Number(
                            currentLease?.monthlyRent ?? 0,
                          ).toLocaleString()}`}
                        />
                      </Col>
                    </Row>
                  </div>
                </div>
              ) : (
                <VacantState onAddLease={toggleCreateLeaseDialog} />
              )}
            </CardBody>
          </Card>
        </TabPane>

        {/* ===================================================== */}
        {/* LEASE */}
        {/* ===================================================== */}

        <TabPane tabId="lease">
          <Card className="border-0 shadow-sm">
            <CardBody className="p-5">
              {currentLease ? (
                <>
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <h4 className="mb-0 text-lg font-semibold">
                          Current lease
                        </h4>

                        <StatusBadge status={currentLease.status} />
                      </div>

                      <p className="mb-0 text-sm text-gray-500">
                        Active tenancy agreement for this unit.
                      </p>
                    </div>

                    <Button
                      color="danger"
                      outline
                      className="rounded-lg"
                      onClick={toggleTerminateLeaseDialog}
                    >
                      Terminate Lease
                    </Button>
                  </div>

                  <Row className="g-4">
                    <Col md="3">
                      <Detail
                        label="Tenant"
                        value={currentTenant?.name ?? "—"}
                      />
                    </Col>

                    <Col md="3">
                      <Detail
                        label="Start Date"
                        value={formatDate(currentLease.startDate)}
                      />
                    </Col>

                    <Col md="3">
                      <Detail label="End Date" value={leaseEndDate} />
                    </Col>

                    <Col md="3">
                      <Detail
                        label="Monthly Rent"
                        value={`KES ${Number(
                          currentLease.monthlyRent,
                        ).toLocaleString()}`}
                      />
                    </Col>
                  </Row>

                  {/* Terminate modal */}
                  <TerminateLeaseModal
                    isOpen={terminateLeaseDialog}
                    toggle={toggleTerminateLeaseDialog}
                    currentLease={currentLease}
                    currentTenant={currentTenant}
                    unit={unit}
                    initialValues={terminateInitialValues}
                    onSuccess={() => {
                      setTerminateLeaseDialog(false);
                      router.refresh();
                    }}
                  />
                </>
              ) : (
                <VacantState
                  title="No active lease"
                  description="This unit is currently available and does not have an active lease."
                  onAddLease={toggleCreateLeaseDialog}
                />
              )}
            </CardBody>
          </Card>
        </TabPane>

        {/* ===================================================== */}
        {/* PAYMENTS */}
        {/* ===================================================== */}

        <TabPane tabId="payments">
          <Card className="border-0 shadow-sm">
            <CardBody className="p-5">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 className="mb-1 text-lg font-semibold">Payments</h4>

                  <p className="mb-0 text-sm text-gray-500">
                    Track rent charges and payments for this lease.
                  </p>
                </div>

                {currentLease && (
                  <Button color="primary" className="rounded-lg">
                    + Record Payment
                  </Button>
                )}
              </div>

              {currentLease ? (
                <>
                  <Row className="mb-5 g-3">
                    <Col md="4">
                      <FinancialStat
                        label="Total Charges"
                        amount={totalCharges}
                      />
                    </Col>

                    <Col md="4">
                      <FinancialStat
                        label="Total Paid"
                        amount={totalPaid}
                        type="success"
                      />
                    </Col>

                    <Col md="4">
                      <FinancialStat
                        label="Outstanding"
                        amount={outstanding}
                        type={outstanding > 0 ? "danger" : "success"}
                      />
                    </Col>
                  </Row>

                  {rentCharges.length > 0 ? (
                    <div className="space-y-4">
                      {rentCharges.map((charge) => {
                        const chargePaid = charge.payments.reduce(
                          (total, payment) => total + Number(payment.amount),
                          0,
                        );

                        const chargeOutstanding = Math.max(
                          Number(charge.amount) - chargePaid,
                          0,
                        );

                        return (
                          <Card key={charge.id} className="border shadow-none">
                            <CardBody className="p-4">
                              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div>
                                  <p className="mb-1 text-sm text-gray-500">
                                    {charge.period}
                                  </p>

                                  <h5 className="mb-1 font-semibold">
                                    KES {Number(charge.amount).toLocaleString()}
                                  </h5>

                                  <p className="mb-0 text-xs text-gray-500">
                                    Rent charge
                                  </p>
                                </div>

                                <PaymentStatus
                                  outstanding={chargeOutstanding}
                                />
                              </div>

                              <div className="mt-4 border-top pt-4">
                                {charge.payments.length > 0 ? (
                                  <div className="space-y-3">
                                    {charge.payments.map((payment) => (
                                      <div
                                        key={payment.id}
                                        className="rounded-lg bg-gray-50 p-4"
                                      >
                                        <Row className="g-3">
                                          <Col md="3">
                                            <Detail
                                              label="Amount"
                                              value={`KES ${Number(
                                                payment.amount,
                                              ).toLocaleString()}`}
                                            />
                                          </Col>

                                          <Col md="3">
                                            <Detail
                                              label="Method"
                                              value={payment.method}
                                            />
                                          </Col>

                                          <Col md="3">
                                            <Detail
                                              label="Reference"
                                              value={payment.reference ?? "—"}
                                            />
                                          </Col>

                                          <Col md="3">
                                            <Detail
                                              label="Date"
                                              value={formatDate(payment.paidAt)}
                                            />
                                          </Col>
                                        </Row>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="mb-0 text-sm text-gray-500">
                                    No payments have been recorded for this rent
                                    charge.
                                  </p>
                                )}
                              </div>
                            </CardBody>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyTabState
                      title="No rent charges yet"
                      description="Rent charges will appear here once they are created."
                    />
                  )}
                </>
              ) : (
                <EmptyTabState
                  title="No active lease"
                  description="Payments will appear here once this unit has an active lease."
                />
              )}
            </CardBody>
          </Card>
        </TabPane>

        {/* ===================================================== */}
        {/* HISTORY */}
        {/* ===================================================== */}

        <TabPane tabId="history">
          <Card className="border-0 shadow-sm">
            <CardBody className="p-5">
              <div className="mb-5">
                <h4 className="mb-1 text-lg font-semibold">Tenancy history</h4>

                <p className="mb-0 text-sm text-gray-500">
                  Previous and current tenants for this unit.
                </p>
              </div>

              {unit.leases.length > 0 ? (
                <div className="relative">
                  <div className="absolute bottom-5 left-[15px] top-5 w-px bg-gray-200" />

                  <div className="space-y-6">
                    {unit.leases.map((lease) => {
                      const isCurrent = lease.status === "ACTIVE";

                      return (
                        <div key={lease.id} className="relative flex gap-4">
                          <div
                            className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                              isCurrent ? "bg-green-100" : "bg-gray-100"
                            }`}
                          >
                            <div
                              className={`h-3 w-3 rounded-full ${
                                isCurrent ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                          </div>

                          <div className="flex-1 rounded-xl border border-gray-200 p-5">
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                              <div>
                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                  <h5 className="mb-0 font-semibold">
                                    {lease.tenant.name}
                                  </h5>

                                  {isCurrent && (
                                    <StatusBadge status="CURRENT" />
                                  )}
                                </div>

                                <p className="mb-0 text-sm text-gray-500">
                                  {lease.tenant.email}
                                </p>

                                <p className="mb-0 text-sm text-gray-500">
                                  {lease.tenant.phone}
                                </p>
                              </div>

                              <StatusBadge status={lease.status} />
                            </div>

                            <div className="mt-5 border-top pt-5">
                              <Row className="g-4">
                                <Col sm="4">
                                  <Detail
                                    label="Lease Start"
                                    value={formatDate(lease.startDate)}
                                  />
                                </Col>

                                <Col sm="4">
                                  <Detail
                                    label="Lease End"
                                    value={
                                      lease.endDate
                                        ? formatDate(lease.endDate)
                                        : "Present"
                                    }
                                  />
                                </Col>

                                <Col sm="4">
                                  <Detail
                                    label="Monthly Rent"
                                    value={`KES ${Number(
                                      lease.monthlyRent,
                                    ).toLocaleString()}`}
                                  />
                                </Col>
                              </Row>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <EmptyTabState
                  title="No tenancy history"
                  description="This unit has not had any leases yet."
                />
              )}
            </CardBody>
          </Card>
        </TabPane>
      </TabContent>

      {/* ======================================================= */}
      {/* CREATE LEASE MODAL */}
      {/* ======================================================= */}

      <Modal
        isOpen={createLeaseDialog}
        toggle={toggleCreateLeaseDialog}
        centered
      >
        <ModalHeader toggle={toggleCreateLeaseDialog}>Add lease</ModalHeader>

        <Formik
          initialValues={creationInitialValues}
          onSubmit={async (values) => {
            try {
              const result = await addLease({
                ...values,
                tenantId: Number(values.tenantId),
                unitId: Number(values.unitId),
                monthlyRent: Number(values.monthlyRent),
              });

              if (!result.success) {
                console.error(result.message);
                return;
              }

              setCreateLeaseDialog(false);
              router.refresh();
            } catch (error) {
              console.error("Failed to create lease:", error);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalBody>
                <div className="space-y-5">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="mb-1 text-xs text-gray-500">Unit</p>

                    <p className="mb-0 font-semibold">Unit {unit.unitNumber}</p>
                  </div>

                  <FormGroup>
                    <label className="form-label">
                      Tenant <span className="text-danger">*</span>
                    </label>

                    <Field
                      as="select"
                      name="tenantId"
                      className="form-select"
                      required
                    >
                      <option value="">Select a tenant</option>

                      {tenants.map((tenant) => (
                        <option value={tenant.id} key={tenant.id}>
                          {tenant.name}
                        </option>
                      ))}
                    </Field>
                  </FormGroup>

                  <FormGroup>
                    <label className="form-label">
                      Start Date <span className="text-danger">*</span>
                    </label>

                    <Field
                      type="date"
                      name="startDate"
                      className="form-control"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <label className="form-label">End Date</label>

                    <Field
                      type="date"
                      name="endDate"
                      className="form-control"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      Leave blank for an open-ended lease.
                    </p>
                  </FormGroup>

                  <FormGroup>
                    <label className="form-label">
                      Monthly Rent <span className="text-danger">*</span>
                    </label>

                    <div className="input-group">
                      <span className="input-group-text">KES</span>

                      <Field
                        type="number"
                        name="monthlyRent"
                        className="form-control"
                        min="0"
                        required
                      />
                    </div>
                  </FormGroup>
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

                <Button color="success" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Lease"}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}

/* ============================================================= */
/* HELPER COMPONENTS */
/* ============================================================= */

function HeaderStat({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className={`mb-0 truncate text-sm font-semibold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon,
  valueClass = "",
}: {
  label: string;
  value: string;
  icon: string;
  valueClass?: string;
}) {
  return (
    <Card className="h-100 border-0 shadow-sm">
      <CardBody className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-2 text-sm text-gray-500">{label}</p>

            <p className={`mb-0 text-xl font-semibold ${valueClass}`}>
              {value}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 font-semibold text-indigo-600">
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mb-0 break-words font-medium text-gray-800">{value}</p>
    </div>
  );
}

function FinancialStat({
  label,
  amount,
  type = "default",
}: {
  label: string;
  amount: number;
  type?: "default" | "success" | "danger";
}) {
  const valueClass =
    type === "success"
      ? "text-success"
      : type === "danger"
        ? "text-danger"
        : "text-gray-900";

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="mb-1 text-sm text-gray-500">{label}</p>

      <p className={`mb-0 text-xl font-semibold ${valueClass}`}>
        KES {amount.toLocaleString()}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();

  let classes = "bg-gray-100 text-gray-700";

  if (
    normalized === "ACTIVE" ||
    normalized === "OCCUPIED" ||
    normalized === "CURRENT"
  ) {
    classes = "bg-green-100 text-green-700";
  }

  if (normalized === "VACANT") {
    classes = "bg-amber-100 text-amber-700";
  }

  if (normalized === "EXPIRED") {
    classes = "bg-gray-100 text-gray-600";
  }

  if (normalized === "TERMINATED") {
    classes = "bg-red-100 text-red-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {status}
    </span>
  );
}

function PaymentStatus({ outstanding }: { outstanding: number }) {
  if (outstanding <= 0) {
    return <StatusBadge status="PAID" />;
  }

  return (
    <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
      Outstanding KES {outstanding.toLocaleString()}
    </span>
  );
}

function VacantState({
  title = "Unit is vacant",
  description = "No tenant is currently assigned to this unit.",
  onAddLease,
}: {
  title?: string;
  description?: string;
  onAddLease: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 py-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-gray-400 shadow-sm">
        ○
      </div>

      <h5 className="mb-1 font-semibold text-gray-700">{title}</h5>

      <p className="mb-4 text-sm text-gray-500">{description}</p>

      <Button color="success" className="rounded-lg" onClick={onAddLease}>
        Add Lease
      </Button>
    </div>
  );
}

function EmptyTabState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <span className="text-gray-400">—</span>
      </div>

      <h5 className="mb-1 font-semibold text-gray-700">{title}</h5>

      <p className="mb-0 text-sm text-gray-500">{description}</p>
    </div>
  );
}

/* ============================================================= */
/* TERMINATE LEASE MODAL */
/* ============================================================= */

function TerminateLeaseModal({
  isOpen,
  toggle,
  currentLease,
  currentTenant,
  unit,
  initialValues,
  onSuccess,
}: {
  isOpen: boolean;
  toggle: () => void;
  currentLease: any;
  currentTenant: any;
  unit: UnitViewData;
  initialValues: {
    endDate: string;
    terminationReason: string;
  };
  onSuccess: () => void;
}) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Terminate current lease</ModalHeader>

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

            onSuccess();
          } catch (error) {
            console.error("Failed to terminate lease:", error);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalBody>
              <div className="space-y-5">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="mb-1 font-semibold text-amber-800">
                    Terminate this lease?
                  </p>

                  <p className="mb-0 text-sm text-amber-700">
                    This will end the current tenancy and make the unit
                    available for a new lease.
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="mb-1 text-xs text-gray-500">Tenant</p>

                      <p className="mb-0 font-medium">
                        {currentTenant?.name ?? "—"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-xs text-gray-500">Unit</p>

                      <p className="mb-0 font-medium">{unit.unitNumber}</p>
                    </div>
                  </div>
                </div>

                <FormGroup>
                  <label className="form-label">
                    Move-out date <span className="text-danger">*</span>
                  </label>

                  <Field
                    type="date"
                    name="endDate"
                    className="form-control"
                    required
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    The date the tenant officially leaves the unit.
                  </p>
                </FormGroup>

                <FormGroup>
                  <label className="form-label">
                    Reason <span className="text-gray-400">(optional)</span>
                  </label>

                  <Field
                    as="select"
                    name="terminationReason"
                    className="form-select"
                  >
                    <option value="">Select a reason</option>

                    <option value="TENANT_MOVED_OUT">Tenant moved out</option>

                    <option value="MUTUAL_AGREEMENT">Mutual agreement</option>

                    <option value="OTHER">Other</option>
                  </Field>
                </FormGroup>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button color="secondary" type="button" onClick={toggle}>
                Cancel
              </Button>

              <Button color="danger" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Terminating..." : "Terminate Lease"}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

/* ============================================================= */
/* HELPERS */
/* ============================================================= */

function formatDate(date: string | Date | null | undefined) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
