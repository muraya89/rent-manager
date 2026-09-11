import { prisma } from "@/lib/prisma";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import Link from "next/link";
import { redirect } from "next/navigation";

async function createUnit(formData: FormData) {
  "use server";
  
  const propertyId = Number(formData.get("propertyId") as string);
  const unitNumber = formData.get("unitNumber") as string;
  const monthlyRent = formData.get("monthlyRent") as string;

  if (!unitNumber || !monthlyRent) {
    return;
  }

  try {
    await prisma.unit.create({
      data: {
        propertyId,
        unitNumber,
        monthlyRent: Number(monthlyRent),
      },
    });
  } catch (error) {
    console.error("Error creating unit:", error);
    throw error;
  }

  redirect(`/dashboard/properties/${propertyId}`);
}

export default async function AddUnitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const propertyId = Number(id);

  if (Number.isNaN(propertyId)) {
    return <div>Invalid property ID</div>;
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true, name: true },
  });

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div className="px-4">
      <Breadcrumb className="px-4">
        <BreadcrumbItem>
          <Link href="/dashboard/properties" className="no-underline">
            Properties
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>{property.name}</BreadcrumbItem>
      </Breadcrumb>
      {/* <nav className=" mb-4">
        <ol className="flex gap-2 text-sm">
          <li>
            <Link href="/dashboard/properties" className="no-underline text-blue-600 hover:underline">
              Properties
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/dashboard/properties/${propertyId}`} className="no-underline text-blue-600 hover:underline">
              {property.name}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-600">Add Unit</li>
        </ol>
      </nav> */}

      <hr />

      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="bg-gray-100 px-4 py-5 sm:px-10 sm:py-12 rounded-t-lg">
          <h3 className="tracking-tight sm:text-4xl">
            Add Unit to {property.name}
          </h3>
        </div>
        <div className="px-4 py-6">
          <h2 className="text-2xl font-semibold mb-4">Unit Details</h2>
          <hr />

          <form action={createUnit} className="mt-4">
            <input type="hidden" name="propertyId" value={propertyId} />
            <div className="mb-4">
              <label
                htmlFor="unitNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Unit Number
              </label>
              <input
                id="unitNumber"
                name="unitNumber"
                placeholder="e.g., A101, B205"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="monthlyRent"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Monthly Rent (KES)
              </label>
              <input
                id="monthlyRent"
                name="monthlyRent"
                placeholder="e.g., 15000"
                type="number"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-5 flex justify-end gap-4 border-t border-t-gray-200 pt-3">
              <Link href={`/dashboard/properties/${propertyId}`}>
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
                Save Unit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
