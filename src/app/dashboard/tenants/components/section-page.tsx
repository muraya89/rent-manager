"use client";

import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  Table,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import Link from "next/link";
import { Tenant } from "@/app/Types/index";
import Alert from "@/app/shared-components/alert";
import QuickAction from "@/app/shared-components/quick-action";
import EmptyState from "@/app/shared-components/emptyState";

export default function TenantsSectionPage({
  title,
  description,
  tenants,
  alert,
  leasedTenants,
  newTenants,
  expiringTenants,
  unleasedTenants,
}: {
  tenants: Tenant[];
  title: string;
  description: string;
  alert: string;
  leasedTenants: number;
  newTenants: number;
  expiringTenants: number;
  unleasedTenants: number
}) {
  return (
    <div className="px-4">
      <Breadcrumb className="px-4">
        <BreadcrumbItem active>
          <Link href="/dashboard/tenants" className="no-underline">
            Tenants
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <hr />
      <Card className="border-0 mb-4">
        <div className="bg-secondary px-4 py-5 sm:px-10 sm:py-12 rounded-t-lg">
          <h3 className="tracking-tight sm:text-4xl">{title}</h3>
          <p className="text-muted mt-2">{description}</p>
        </div>
        <CardBody className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-muted text-sm">Total Tenants</p>
              <p className="text-2xl font-semibold">{tenants.length}</p>
            </div>
            <div>
              <p className="text-muted text-sm">Active Tenants</p>
              <p className="text-2xl font-semibold">{leasedTenants}</p>
            </div>
            <div>
              <p className="text-muted text-sm">Expiring Soon</p>
              <p className="text-2xl font-semibold">{expiringTenants}</p>
            </div>
            <div>
              <p className="text-muted text-sm">New Tenants</p>
              <p className="text-2xl font-semibold">{newTenants}</p>
            </div>
            <div>
              <p className="text-muted text-sm">Without Lease</p>
              <p className="text-2xl font-semibold">{unleasedTenants.length}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border-0">
        <CardBody className="px-4">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="mb-0 w-99">
              <Alert message={alert} />
            </CardTitle>
            <Link href={`/dashboard/tenants/add`}>
              <Button color="primary" className="rounded-xl px-4 py-2">
                Add Tenant
              </Button>
            </Link>
          </div>

          <hr />
          <div className="p-7 sm:p-10">
            {tenants.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <tr key={tenant.id}>
                      <td>{tenant.name}</td>
                      <td>{tenant.email}</td>
                      <td>{tenant.phone}</td>
                      <td>
                        <Link
                          href={`/dashboard/tenants/${tenant.id}`}
                          className="text-primary"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Row className="g-4">
                <Col md="8">
                  <EmptyState title={title} />
                </Col>
                <Col md="4">
                  <QuickAction title={title} />
                </Col>
              </Row>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
