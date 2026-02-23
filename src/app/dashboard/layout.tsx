"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Info,
  Mail,
  Menu,
  Briefcase,
  Users,
  Sparkles,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-100 text-gray-800">

      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 shadow-xl bg-white border-r ${
          open ? "w-64" : "w-20"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          {open && (
            <h1 className="text-xl font-bold text-cyan-600">
              HireGen AI
            </h1>
          )}

          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            className="p-1 rounded-md hover:bg-cyan-100 transition"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mt-6 px-2">
          <SidebarLink
            icon={<LayoutDashboard size={20} />}
            label="Home"
            open={open}
            href="/dashboard"
          />

          <SidebarLink
            icon={<Briefcase size={20} />}
            label="Jobs"
            open={open}
            href="/dashboard/jobs"
          />

          <SidebarLink
            icon={<Users size={20} />}
            label="Candidates"
            open={open}
            href="/dashboard/candidates"
          />

          <SidebarLink
            icon={<Sparkles size={20} />}
            label="Tools"
            open={open}
            href="/dashboard/tools"
          />

          <SidebarLink
            icon={<BarChart3 size={20} />}
            label="Analytics"
            open={open}
            href="/dashboard/analytics"
          />

          <SidebarLink
            icon={<Info size={20} />}
            label="About"
            open={open}
            href="/dashboard/about"
          />

          <SidebarLink
            icon={<Mail size={20} />}
            label="Contact"
            open={open}
            href="/dashboard/contact"
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}

/* ================= Sidebar Link Component ================= */

function SidebarLink({
  icon,
  label,
  open,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  href: string;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        active
          ? "bg-cyan-100 text-cyan-600 font-semibold"
          : "hover:bg-cyan-100 hover:text-cyan-600"
      }`}
    >
      {icon}
      {open && <span>{label}</span>}
    </Link>
  );
}