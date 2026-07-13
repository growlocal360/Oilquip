import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const jobId = searchParams.get("job_id");
  const search = searchParams.get("search");

  let query = supabase
    .from("job_applications")
    .select("*, job:job_postings(id, title, slug)")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }
  if (jobId === "null") {
    query = query.is("job_id", null);
  } else if (jobId) {
    query = query.eq("job_id", jobId);
  }
  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,position_desired.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  // Public endpoint — anyone can submit an application
  const body = await request.json();

  // Basic honeypot check — bots often fill hidden fields.
  if (body._hp && body._hp.length > 0) {
    return NextResponse.json({ success: true });
  }
  delete body._hp;

  // Minimum required fields
  const required = ["first_name", "last_name", "email", "phone", "application_type"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }
  if (!body.reference_verification_ack || !body.background_check_consent) {
    return NextResponse.json(
      { error: "Both consents must be acknowledged" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_applications")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id });
}
