"use client";

import Link from "next/link";
import { Button, Card, CardBody,  Container } from "reactstrap";

export default function ReportsSectionPage({}: {
}) {
  return (
    <main className="min-h-screen bg-[#f7f8fc] py-8 text-[#18212f]">
      <Container className="max-w-5xl px-5 sm:px-8 lg:px-12">
        <Button
          tag={Link}
          href="/dashboard"
          color="link"
          className="inline-flex items-center gap-2 p-0 text-sm font-semibold text-[#4437d8] text-decoration-none"
        >
          ← Back to overview
        </Button>

        <Card className="mt-8 overflow-hidden rounded-2xl border-slate-200 shadow-sm">
          <CardBody className="p-0">
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-100 text-xl font-light text-[#4437d8]">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              </div>
              <p className="font-semibold text-slate-700">
                Updates coming soon
              </p>
              <p className="mt-2 text-sm text-slate-500">
                You can view your reports here once you have generated them.
              </p>
            </div>
          </CardBody>
        </Card>
      </Container>
    </main>
  );
}

