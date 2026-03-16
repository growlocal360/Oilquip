import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to reset password page for recovery flows
  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/customer-portal/reset-password`);
  }

  // Redirect to admin after successful auth
  return NextResponse.redirect(`${origin}/admin`);
}
