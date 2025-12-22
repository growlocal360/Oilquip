"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  FolderOpen,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "News",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    label: "Careers",
    href: "/admin/careers",
    icon: Briefcase,
  },
  {
    label: "Resources",
    href: "/admin/resources",
    icon: FolderOpen,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-steel-900 border-r border-steel-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-steel-700">
        <Link href="/admin" className="block">
          <Image
            src="/oilquip-engineering-power-generation-white.svg"
            alt="Oilquip Admin"
            width={160}
            height={40}
            className="h-8 w-auto"
          />
        </Link>
        <p className="text-steel-500 text-xs mt-2">Content Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors",
                active
                  ? "bg-accent-500/10 text-accent-400 border border-accent-500/30"
                  : "text-steel-400 hover:text-steel-200 hover:bg-steel-800"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-steel-700">
        <Link
          href="/"
          target="_blank"
          className="flex items-center space-x-2 text-steel-500 hover:text-steel-300 text-sm transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          <span>View Website</span>
        </Link>
      </div>
    </aside>
  );
}
