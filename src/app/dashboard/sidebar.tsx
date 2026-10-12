"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Nav,
  NavItem,
  NavLink,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
} from "reactstrap";
import { navigation } from "@/app/data/dashboard";
import { Icon } from "./dashboard-icon";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full min-w-0 flex-col px-4 py-5">
      <div className="mb-7 flex items-center gap-3 px-3">
        <div className="rentwise-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white">
          R
        </div>
        <div className="min-w-0">
          <span className="block text-lg font-bold tracking-tight text-primary">
            Rentwise
          </span>
          <span className="whitespace-nowrap text-[10px] font-medium tracking-wide">
            PROPERTY MANAGER
          </span>
        </div>
      </div>
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-primary">
        Workspace
      </p>
      <Nav vertical className="rentwise-nav space-y-1">
        {navigation.map((item) => (
          <NavItem key={item.label}>
            <NavLink
              tag={Link}
              href={item.href}
              onClick={onNavigate}
              active={pathname === item.href}
              className={`flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${pathname === item.href ? "is-active" : ""}`}
            >
              <span className="shrink-0">
                <Icon name={item.icon} size={18} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <div className="mt-auto flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.06] px-3 py-2.5">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-white text-xs font-bold shadow-md shadow-black/20">
          JM
        </div>
        <div className="min-w-0 py-3">
          <p className="whitespace-nowrap text-sm font-semibold text-primary mb-0">
            James Mwangi
          </p>
          <p className="text-xs text-primary-200 mb-0">Administrator</p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({
  isMobileOpen,
  onMobileClose,
}: {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}) {
  return (
    <>
      <aside className="rentwise-sidebar sticky top-0 hidden h-screen w-[270px] shrink-0 overflow-hidden lg:flex">
        <SidebarContent />
      </aside>
      <Offcanvas
        isOpen={isMobileOpen}
        toggle={onMobileClose}
        direction="start"
        className="rentwise-mobile-sidebar d-lg-none"
        aria-label="Main navigation"
      >
        <OffcanvasHeader
          toggle={onMobileClose}
          className="border-0 bg-transparent text-white"
        />
        <OffcanvasBody className="p-0">
          <SidebarContent onNavigate={onMobileClose} />
        </OffcanvasBody>
      </Offcanvas>
    </>
  );
}
