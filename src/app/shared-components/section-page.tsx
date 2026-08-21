"use client";

import { Card, CardBody, Container } from "reactstrap";

export default function SectionPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mt-4 overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <CardBody className="p-0">
        <div className="bg-primary px-7 py-9 text-white sm:px-10 sm:py-12">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[.14em] text-indigo-100">
            Rentwise workspace
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
            {description}
          </p>
        </div>
        {children}
      </CardBody>
    </Card>
  );
}
