import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  const publishedOnly = searchParams.get("published") === "true";

  const supabase = await createClient();

  let query = supabase
    .from("resources")
    .select("*, category:resource_categories(*)")
    .order("display_order", { ascending: true });

  if (publishedOnly) {
    query = query.eq("published", true);
  }

  if (categorySlug) {
    // First get the category ID
    const { data: category } = await supabase
      .from("resource_categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (category) {
      query = query.eq("category_id", category.id);
    }
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("resources")
    .insert(body)
    .select("*, category:resource_categories(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
