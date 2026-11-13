"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Menu,
  MessageSquare,
  ReceiptText,
  Settings,
  Shield,
  Wallet,
  X,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default function ClientSidebar({
  isAdmin = false,
  adminView = false,
}: {
  isAdmin?: boolean;
  adminView?: boolean;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const navItems = adminView
    ? [
        { label: "Ledger Control", href: "/admin", icon: Shield },
        { label: "Client Portal", href: "/dashboard", icon: ArrowLeft },
      ]
    : [
        { label: "Overview", href: "/dashboard", icon: Wallet },
        { label: "Transfers", href: "/dashboard/transfers", icon: ArrowUpRight },
        { label: "Transaction History", href: "/dashboard/transactions", icon: ReceiptText },
        { label: "Concierge", href: "/dashboard/concierge", icon: MessageSquare },
        {
          label: "Settings",
          href: "/dashboard/settings",
          icon: Settings,
        },
        ...(isAdmin
          ? [{ label: "Admin Console", href: "/admin", icon: Shield }]
          : []),
      ];

  return (
    <>
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-white/10 bg-[#101720] p-7 lg:block">
        <Link href={adminView ? "/admin" : "/dashboard"}>
          <h1 className="text-2xl font-serif tracking-widest text-[#D6B77A]">
            AURELIA
          </h1>
          <p className="mt-1 text-[9px] tracking-[0.3em] text-gray-500">
            {adminView ? "EXECUTIVE ADMIN" : "PRIVATE BANKING"}
          </p>
        </Link>

        <nav className="mt-16 space-y-6 text-sm text-gray-400">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 transition hover:text-[#D6B77A]"
            >
              <item.icon size={19} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-10 left-7">
          <LogoutButton />
        </div>
      </aside>

      <header className="relative flex flex-wrap items-center justify-between border-b border-white/10 bg-[#101720] px-6 py-4 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={sidebarOpen}
          className="cursor-pointer text-gray-400 hover:text-white focus:outline-none"
        >
          <Menu size={25} />
        </button>
        <Link href={adminView ? "/admin" : "/dashboard"}>
          <span className="font-serif tracking-widest text-[#D6B77A]">
            AURELIA
          </span>
        </Link>
        <span className="w-[25px]" aria-hidden="true" />
        <nav
          aria-label="Mobile navigation"
          className="w-full flex gap-3.5 overflow-x-auto pt-4 text-xs whitespace-nowrap"
        >
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  active ? "text-[#D6B77A]" : "text-gray-400 hover:text-white"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 lg:hidden motion-overlay"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            onClick={(event) => event.stopPropagation()}
            className="flex h-full w-72 max-w-[85vw] flex-col border-r border-white/10 bg-[#101720] p-7 shadow-2xl motion-drawer"
          >
            <div className="flex items-start justify-between">
              <Link
                href={adminView ? "/admin" : "/dashboard"}
                onClick={() => setSidebarOpen(false)}
              >
                <h2 className="text-2xl font-serif tracking-widest text-[#D6B77A]">
                  AURELIA
                </h2>
                <p className="mt-1 text-[9px] tracking-[0.3em] text-gray-500">
                  {adminView ? "EXECUTIVE ADMIN" : "PRIVATE BANKING"}
                </p>
              </Link>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close navigation menu"
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="mt-12 space-y-7 text-sm text-gray-300">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 transition hover:text-[#D6B77A]"
                >
                  <item.icon size={19} />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-white/10 pt-6">
              <LogoutButton />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
