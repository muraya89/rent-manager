import { redirect } from "next/navigation";

export default function UnitsPage() {
  // This page redirects to the property detail page
  redirect("/dashboard/properties");
}