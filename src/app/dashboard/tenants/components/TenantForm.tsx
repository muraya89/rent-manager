"use client";

import { Card, Nav, NavItem, NavLink, FormGroup, Label } from "reactstrap";
import { Field, useFormikContext } from "formik";
import { useState, useEffect } from "react";
import BadgeComponent from "@/app/shared-components/badge";
import PlainInput from "@/app/shared-components/plainInput";
import SectionTitle from "@/app/shared-components/sectionTitle";
import OccupiedSwitch from "@/app/shared-components/switch";
import { getNotLeasedTenant } from "@/lib/queries/tenantQueries";
import { getPropertyUnits } from "@/lib/queries/unitQueries";
import { getProperties } from "@/lib/queries/propertyQueries";
import { Tenant, TenantMode } from "@/app/Types/tenant";
import { Unit, Property } from "@/app/Types";
import { RENT_DUE_DAYS } from "@/constants/lease";

type TenantFormContext = "unit" | "tenant";

type TenantFormValues = {
  tenantMode: TenantMode;
  tenantId: string;
  tenant: { name: string; email: string; phone: string };
  isOccupied: boolean;
  // Select values are always strings; convert with Number() when calling the server.
  propertyId: string;
  unitId: string;
  lease: {
    rentDueDay: number;
    occupants: number | "";
    startDate: string;
    endDate: string;
    monthlyRent: number | "";
    depositAmount: number | "";
  };
};

// Units are tagged with the property they were fetched for, so "loading" and
// "stale list" can be derived instead of tracked with fragile boolean flags.
type UnitsState = {
  propertyId: string;
  units: Unit[];
  error: string | null;
};

const TABS: { id: TenantMode; label: string }[] = [
  { id: "new", label: "New Tenant" },
  { id: "existing", label: "Existing Tenant" },
];

export default function TenantForm({
  className = "",
  context = "unit",
  propertyId,
}: {
  className?: string;
  context?: TenantFormContext;
  /** When provided, the property is pre-selected and cannot be changed. */
  propertyId?: number | string | null;
}) {
  const inUnitForm = context === "unit";

  const { values, setFieldValue, errors, touched } =
    useFormikContext<TenantFormValues>();

  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [tenantsLoaded, setTenantsLoaded] = useState(false);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [unitsState, setUnitsState] = useState<UnitsState | null>(null);
  const [error, setError] = useState<string | null>(null);

  // A property passed in from the page wins over whatever the user picks.
  const lockedPropertyId = propertyId != null ? String(propertyId) : "";
  const propertyLocked = lockedPropertyId !== "";

  const selectedPropertyId = String(values.propertyId ?? "");
  const unitsReady = unitsState?.propertyId === selectedPropertyId;
  const availableUnits = unitsReady ? unitsState.units : [];
  const unitsError = unitsReady ? unitsState.error : null;
  const loadingUnits =
    values.isOccupied && selectedPropertyId !== "" && !unitsReady;

  // Vacant units only. Adjust if your Unit type exposes occupancy differently.
  const vacantUnits = availableUnits.filter((u) => !u.leases?.length);

  // Keep the form value in sync with the locked property.
  useEffect(() => {
    if (propertyLocked && values.propertyId !== lockedPropertyId) {
      setFieldValue("propertyId", lockedPropertyId);
    }
  }, [propertyLocked, lockedPropertyId, values.propertyId, setFieldValue]);

  // Properties: only needed once the user wants to assign a unit.
  useEffect(() => {
    if (!values.isOccupied || properties.length) return;

    let cancelled = false;

    getProperties()
      .then((list) => {
        if (!cancelled) setProperties(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load properties");
      });

    return () => {
      cancelled = true;
    };
  }, [values.isOccupied, properties.length]);

  // Tenants: only needed in "existing" mode, fetched once.
  useEffect(() => {
    if (values.tenantMode !== "existing" || tenantsLoaded) return;

    let cancelled = false;
    setLoadingTenants(true);
    setError(null);

    getNotLeasedTenant()
      .then((tenants) => {
        if (cancelled) return;
        setAvailableTenants(tenants);
        setTenantsLoaded(true);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load tenants");
      })
      .finally(() => {
        if (!cancelled) setLoadingTenants(false);
      });

    return () => {
      cancelled = true;
    };
  }, [values.tenantMode, tenantsLoaded]);

  // Units: refetch whenever the selected property changes.
  useEffect(() => {
    if (!values.isOccupied || !values.propertyId) return;

    const requested = String(values.propertyId);
    let cancelled = false;

    getPropertyUnits(Number(requested))
      .then((units) => {
        if (!cancelled) {
        }
      })
      .catch((err) => {
        if (cancelled) return;
        // Store the failure against this property so the spinner stops.
        setUnitsState({
          propertyId: requested,
          units: [],
          error: err.message ?? "Failed to load units",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [values.isOccupied, values.propertyId]);

  const selectedTenant = availableTenants.find(
    (t) => String(t.id) === values.tenantId,
  );

  const switchMode = (mode: TenantMode) => {
    if (mode === values.tenantMode) return;
    setFieldValue("tenantMode", mode);
    // Clear the other mode's data so it can never be submitted by accident.
    if (mode === "new") setFieldValue("tenantId", "");
    else setFieldValue("tenant", { name: "", email: "", phone: "" });
  };

  const handleAssignedChange = (checked: boolean) => {
    setFieldValue("isOccupied", checked);
    if (!checked) {
      // Clear stale occupancy data when switched off.
      if (!propertyLocked) setFieldValue("propertyId", "");
      setFieldValue("unitId", "");
    }
  };

  const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldValue("propertyId", e.target.value);
    setFieldValue("unitId", "");
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const unit = availableUnits.find((u) => String(u.id) === e.target.value);
    setFieldValue("unitId", e.target.value);
    if (unit) {
      setFieldValue("lease.monthlyRent", unit.monthlyRent);
      setFieldValue("lease.depositAmount", unit.defaultDeposit);
    }
  };

  return (
    <>
      <Card className={`${className} py-6`}>
        {error && <div className="text-danger small mb-2">{error}</div>}

        <div className="d-flex justify-between items-center">
          <SectionTitle title="Tenant Information" />

          {inUnitForm && (
            <Nav tabs className="border-0">
              {TABS.map((tab) => (
                <NavItem key={tab.id}>
                  <NavLink
                    href="#"
                    active={values.tenantMode === tab.id}
                    onClick={(e) => {
                      e.preventDefault();
                      switchMode(tab.id);
                    }}
                    className={`cursor-pointer rounded-t-lg border-0 px-4 py-3 text-sm transition  ${
                      values.tenantMode === tab.id
                        ? "bg-sidebar !rounded-4xl text-white"
                        : "!text-gray-500 !hover:bg-gray-50 !hover:text-gray-800"
                    }`}
                  >
                    {tab.label}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          )}
        </div>

        {values.tenantMode === "new" ? (
          <>
            <FormGroup>
              <Label for="tenant.name" className="font-semibold">
                Name
              </Label>
              <Field
                id="tenant.name"
                component={PlainInput}
                name="tenant.name"
                type="text"
                required
                placeholder="e.g., Jane Doe, John Doe"
              />
            </FormGroup>

            <div className="d-flex gap-3">
              <FormGroup className="w-full">
                <Label for="tenant.email" className="font-semibold">
                  Email
                </Label>
                <Field
                  id="tenant.email"
                  component={PlainInput}
                  name="tenant.email"
                  type="text"
                  required
                  placeholder="e.g., example@gmail.com"
                />
              </FormGroup>

              <FormGroup className="w-full">
                <Label for="tenant.phone" className="font-semibold">
                  Phone Number
                </Label>
                <Field
                  id="tenant.phone"
                  component={PlainInput}
                  name="tenant.phone"
                  type="text"
                  required
                  placeholder="e.g., +254712345678"
                />
              </FormGroup>
            </div>
          </>
        ) : (
          <>
            <FormGroup>
              <Label for="tenantId" className="font-semibold">
                Tenant
              </Label>
              <Field
                as="select"
                id="tenantId"
                name="tenantId"
                className="form-select"
                disabled={loadingTenants}
              >
                <option value="">
                  {loadingTenants ? "Loading tenants…" : "Select a tenant…"}
                </option>
                {availableTenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} · {t.phone}
                  </option>
                ))}
              </Field>
              {touched.tenantId && errors.tenantId && (
                <div className="text-danger small mt-1">{errors.tenantId}</div>
              )}
            </FormGroup>

            {selectedTenant && (
              <div className="d-flex justify-between items-center px-4 py-2 w-100 bg-(--background) border-2 rounded-xl">
                <div className="d-flex gap-3 items-center">
                  <div className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-(--primary) bg-(--primary-light)">
                    {/* {tenant?.initials} */}
                  </div>

                  <div className="d-flex flex-col">
                    <p className="font-bold text-slate-700 mb-0">
                      {selectedTenant.name}
                    </p>

                    <div>
                      <span className="text-slate-700 mb-0">
                        {selectedTenant.email}
                      </span>
                      &nbsp; : &nbsp;
                      <span className="text-slate-700 mb-0">
                        {selectedTenant.phone}
                      </span>
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
            )}
          </>
        )}

        {!inUnitForm && (
          <OccupiedSwitch
            id="isOccupied"
            checked={values.isOccupied}
            onChange={handleAssignedChange}
            title="Assign to a unit now"
            description="Turn on to choose a unit and set up the lease. You can also do this later from the tenant's page"
          />
        )}
      </Card>

      {/* TODO: personal details (KRA pin, nationality) */}

      {/* Occupancy details */}
      {values.isOccupied && (
        <>
          {!inUnitForm && (
            <Card className={`${className} py-6 my-4`}>
              <SectionTitle title="Occupancy" className="mb-3" />

              {!propertyLocked && (
                <div className="d-flex gap-4">
                  <FormGroup className="w-full">
                    <Label for="propertyId" className="font-semibold">
                      Property
                    </Label>
                    <Field
                      as="select"
                      id="propertyId"
                      name="propertyId"
                      className="form-select"
                      disabled={propertyLocked}
                      onChange={handlePropertyChange}
                    >
                      <option value="">
                        {properties.length
                          ? "Select a property..."
                          : "Loading properties…"}
                      </option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} · {p.address}
                        </option>
                      ))}
                    </Field>
                  </FormGroup>

                  <FormGroup className="w-full">
                    <Label for="unitId" className="font-semibold">
                      Vacant Unit
                    </Label>
                    <Field
                      as="select"
                      id="unitId"
                      name="unitId"
                      className="form-select"
                      disabled={!values.propertyId || loadingUnits}
                      onChange={handleUnitChange}
                    >
                      <option value="">
                        {loadingUnits
                          ? "Loading units…"
                          : unitsReady && !vacantUnits.length && !unitsError
                            ? "No vacant units"
                            : "Select a unit..."}
                      </option>
                      {vacantUnits.map((u) => (
                        <option key={u.id} value={u.id}>
                          Unit {u.unitNumber}
                        </option>
                      ))}
                    </Field>
                    {unitsError && (
                      <div className="text-danger small mt-1">{unitsError}</div>
                    )}
                  </FormGroup>
                </div>
              )}
            </Card>
          )}

          <Card className={`${className} py-6 my-4`}>
            <SectionTitle title="Lease Information" className="mb-3" />

            <div className="metric-grid">
              <FormGroup className="w-full">
                <Label for="lease.startDate" className="font-semibold">
                  Lease Start
                </Label>
                <Field
                  id="lease.startDate"
                  component={PlainInput}
                  name="lease.startDate"
                  type="date"
                  required
                />
              </FormGroup>

              <FormGroup className="w-full">
                <Label for="lease.endDate" className="font-semibold">
                  Lease End
                </Label>
                <Field
                  id="lease.endDate"
                  component={PlainInput}
                  name="lease.endDate"
                  type="date"
                />
              </FormGroup>

              {!inUnitForm && (
                <FormGroup className="w-full">
                  <Label for="lease.monthlyRent" className="font-semibold">
                    Monthly Rent (KES)
                  </Label>
                  <Field
                    id="lease.monthlyRent"
                    component={PlainInput}
                    name="lease.monthlyRent"
                    type="number"
                    required
                  />
                </FormGroup>
              )}

              <FormGroup className="w-full">
                <Label for="lease.depositAmount" className="font-semibold">
                  Deposit (KES)
                </Label>
                <Field
                  id="lease.depositAmount"
                  component={PlainInput}
                  name="lease.depositAmount"
                  type="number"
                  required
                />
              </FormGroup>

              <FormGroup className="w-full">
                <Label for="lease.rentDueDay" className="font-semibold">
                  Rent due day
                </Label>
                <Field
                  as="select"
                  id="lease.rentDueDay"
                  name="lease.rentDueDay"
                  className="form-select"
                  type="select"
                  required
                >
                  {RENT_DUE_DAYS.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </Field>
              </FormGroup>

              <FormGroup className="w-full">
                <Label for="lease.occupants" className="font-semibold">
                  Number of occupants
                </Label>
                <Field
                  id="lease.occupants"
                  name="lease.occupants"
                  component={PlainInput}
                  type="number"
                  required
                />
              </FormGroup>
            </div>
          </Card>
        </>
      )}
    </>
  );
}
