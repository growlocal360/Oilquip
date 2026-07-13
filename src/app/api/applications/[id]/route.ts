import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
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

  const { data, error } = await supabase
    .from("job_applications")
    .select("*, job:job_postings(id, title, slug)")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Generate a signed URL for the resume so admin can download it.
  let resume_signed_url: string | null = null;
  if (data.resume_url) {
    // The stored file path is the last two segments after the bucket domain,
    // e.g. .../applications/resumes/<file>.pdf → resumes/<file>.pdf
    const match = data.resume_url.match(/\/applications\/(.+)$/);
    if (match) {
      const { data: signed } = await supabase.storage
        .from("applications")
        .createSignedUrl(match[1], 60 * 60); // 1 hour
      resume_signed_url = signed?.signedUrl ?? null;
    }
  }

  return NextResponse.json({ ...data, resume_signed_url });
}

export async function PATCH(
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

  const allowed = ["status"];
  const patch: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) patch[key] = body[key];
  }

  const { data, error } = await supabase
    .from("job_applications")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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

  // Fetch the row so we can also delete its resume file if any.
  const { data: existing } = await supabase
    .from("job_applications")
    .select("resume_url")
    .eq("id", id)
    .single();

  if (existing?.resume_url) {
    const match = existing.resume_url.match(/\/applications\/(.+)$/);
    if (match) {
      await supabase.storage.from("applications").remove([match[1]]);
    }
  }

  const { error } = await supabase
    .from("job_applications")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
