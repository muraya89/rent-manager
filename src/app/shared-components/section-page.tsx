"use client";

import { CardBody } from "reactstrap";
import React from "react";
import Link from "next/link";

export default function SectionPage({
  title,
  description,
  link,
  linkCaption,
  children,
}: {
  title: string;
  description: string;
  link: string;
  linkCaption: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <CardBody className="p-0">
        <div className="d-flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="px-4 flex flex-col">
            <span className="font-bold sm:text-4xl">{title}</span>
            <span className="max-w-xl leading-6 sm:text-base text-muted">
              {description}
            </span>
          </div>

          {link && (
            <Link
              href={link}
              className="btn btn-primary rounded-pill px-4 py-2 fw-semibold no-underline text-white"
            >
              + {linkCaption}
            </Link>
          )}
        </div>

        {children}
      </CardBody>
    </>
  );
}
