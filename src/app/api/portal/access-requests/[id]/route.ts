import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Get the access request details first
  const { data: accessRequest } = await supabase
    .from("portal_access_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (!accessRequest) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  // Update the status
  const { data, error } = await supabase
    .from("portal_access_requests")
    .update({
      status: body.status,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If approved, add the user to portal_users under the matching customer
  if (body.status === "approved") {
    // Find the customer by name
    const { data: customer } = await supabase
      .from("portal_customers")
      .select("id")
      .eq("name", accessRequest.company_name)
      .single();

    if (customer) {
      // Check if portal user already exists
      const { data: existingUser } = await supabase
        .from("portal_users")
        .select("id")
        .eq("email", accessRequest.email)
        .single();

      if (!existingUser) {
        await supabase.from("portal_users").insert({
          customer_id: customer.id,
          email: accessRequest.email,
          name: accessRequest.name,
        });
      }
    }
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("portal_access_requests")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
