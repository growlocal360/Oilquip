import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Oilquip Admin",
  description: "Admin login for Oilquip content management",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-steel-950 flex items-center justify-center p-4">
      {children}
    </div>
  );
}
