import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is an admin
  const { data: admin } = await supabase
    .from("approved_emails")
    .select("id")
    .eq("email", user.email)
    .single();

  if (admin) {
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: "Admin",
      is_admin: true,
    });
  }

  const { data: portalUser, error } = await supabase
    .from("portal_users")
    .select("*, customer:portal_customers(*)")
    .eq("email", user.email)
    .eq("active", true)
    .single();

  if (error || !portalUser) {
    return NextResponse.json({ error: "Portal user not found" }, { status: 404 });
  }

  return NextResponse.json(portalUser);
}
