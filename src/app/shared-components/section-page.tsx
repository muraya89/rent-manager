"use client";

import { CardBody, Container } from "reactstrap";
import React from "react";

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
    <>
      <CardBody className="p-0">
        <div className="px-4">
          {/* <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[.14em] text-indigo-100">
            Rentwise workspace
          </span> */}
          <h4 className="font-bold tracking-tight sm:text-4xl">
            {title}
          </h4>
          <span className="max-w-xl text-sm leading-6 sm:text-base">
            {description}
          </span>
        </div>

        {children}
      </CardBody>
    </>
  );
}
