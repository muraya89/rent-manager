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
        <div className="px-4 flex flex-col">
          {/* <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[.14em] text-indigo-100">
            Rentwise workspace
          </span> */}
          <span className="font-bold sm:text-4xl">
            {title}
          </span>
          <span className="max-w-xl leading-6 sm:text-base text-muted">
            {description}
          </span>
        </div>

        {children}
      </CardBody>
    </>
  );
}
