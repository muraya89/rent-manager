"use client";
import { Sidebar } from "@/app/(dashboard)/dashboard/sidebar";
import { useState } from "react";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <main className="min-h-screen bg-[#f7f8fc] ">
      <div className="flex min-h-screen w-full">
        <Sidebar
          isMobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <section className="min-w-0 flex-1 px-4 py-4 sm:px-8 lg:px-10 lg:py-7">
          {children}
        </section>
      </div>
    </main>
  );
}
