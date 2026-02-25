"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { PortalUser } from "@/lib/types";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [portalUser, setPortalUser] = useState<
    PortalUser & { customer?: { id: string; name: string } }
  >();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/portal/me");
      if (response.ok) {
        const data = await response.json();
        setPortalUser(data);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/customer-portal");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-steel-950 flex items-center justify-center">
        <div className="animate-pulse text-steel-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steel-950">
      {/* Header */}
      <header className="bg-steel-900 border-b border-steel-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <Link href="/customer-portal/dashboard">
                <Image
                  src="/oilquip-engineering-power-generation-white.svg"
                  alt="Oilquip"
                  width={150}
                  height={38}
                  className="h-8 w-auto"
                />
              </Link>
              {portalUser?.customer && (
                <div className="hidden sm:block border-l border-steel-700 pl-6">
                  <span className="text-steel-400 text-sm">
                    {portalUser.customer.name}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-steel-400 text-sm hidden sm:block">
                {portalUser?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-steel-400 hover:text-steel-200 hover:bg-steel-800 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
