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
