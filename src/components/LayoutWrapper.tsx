"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide navigation and footer on admin, auth, portal, and printable pages
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/auth");
  const isPortalRoute = pathname.startsWith("/customer-portal");
  const isPrintRoute = pathname === "/careers/apply/print";
  const hideLayout = isAdminRoute || isAuthRoute || isPortalRoute || isPrintRoute;

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
}
