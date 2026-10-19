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
import LogoutButton from "@/app/auth/components/logoutButton";
import { useSession } from "next-auth/react";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const getInitials = (name?: string | null): string => {
    if (!name?.trim()) return "";

    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join("");
  };
  return (
    <div className="flex h-full min-w-0 w-full flex-col px-4 py-5  text-white">
      <div className="mb-7 flex items-center gap-3 px-3">
        <div className="min-w-0">
          <a className="brand" href="#top" aria-label="rentwise home">
            <span className="brand-mark">r</span>
            <span className="brand-text ">RentWise</span>
          </a>
        </div>
      </div>
      {/* <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-primary">
        Workspace
      </p> */}
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
          {getInitials(user?.name)}
        </div>
        <div className="min-w-0 py-3">
          <p className="whitespace-nowrap text-sm font-semibold mb-0">
            {user?.name}
          </p>
          <p className="text-xs text-primary-200 text-lowercase mb-0">
            {user?.role}
          </p>
        </div>
      </div>
      <Nav>
        <LogoutButton />
      </Nav>
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
