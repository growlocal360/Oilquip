import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if user email is in approved_emails table
    const { data: approved } = await supabase
      .from("approved_emails")
      .select("id")
      .eq("email", user.email)
      .single();

    if (!approved) {
      return NextResponse.redirect(
        new URL("/login?error=unauthorized", request.url)
      );
    }
  }

  // Protect customer portal routes
  if (
    request.nextUrl.pathname.startsWith("/customer-portal/dashboard") ||
    request.nextUrl.pathname.startsWith("/customer-portal/projects")
  ) {
    if (!user) {
      return NextResponse.redirect(
        new URL("/customer-portal", request.url)
      );
    }

    // Allow admin users to access portal
    const { data: admin } = await supabase
      .from("approved_emails")
      .select("id")
      .eq("email", user.email)
      .single();

    if (!admin) {
      const { data: portalUser } = await supabase
        .from("portal_users")
        .select("id")
        .eq("email", user.email)
        .eq("active", true)
        .single();

      if (!portalUser) {
        return NextResponse.redirect(
          new URL("/customer-portal?error=unauthorized", request.url)
        );
      }
    }
  }

  // Redirect logged-in portal users from login to dashboard
  if (request.nextUrl.pathname === "/customer-portal" && user) {
    // Check if admin
    const { data: admin } = await supabase
      .from("approved_emails")
      .select("id")
      .eq("email", user.email)
      .single();

    if (admin) {
      return NextResponse.redirect(
        new URL("/customer-portal/dashboard", request.url)
      );
    }

    const { data: portalUser } = await supabase
      .from("portal_users")
      .select("id")
      .eq("email", user.email)
      .eq("active", true)
      .single();

    if (portalUser) {
      return NextResponse.redirect(
        new URL("/customer-portal/dashboard", request.url)
      );
    }
  }

  // Redirect logged-in users away from login page
  if (request.nextUrl.pathname === "/login" && user) {
    const { data: approved } = await supabase
      .from("approved_emails")
      .select("id")
      .eq("email", user.email)
      .single();

    if (approved) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/customer-portal/:path*"],
};
