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

  const { data, error } = await supabase
    .from("portal_access_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Public endpoint - no auth required
export async function POST(request: Request) {
  const supabase = await createClient();

  const body = await request.json();

  if (!body.email || !body.name || !body.company_name) {
    return NextResponse.json(
      { error: "Name, email, and company name are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("portal_access_requests")
    .insert({
      email: body.email,
      name: body.name,
      company_name: body.company_name,
      message: body.message || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
