import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Only run for /admin routes (including sub-pages like /admin/projects)
  if (path.startsWith("/admin")) {
    const adminKey = process.env.ADMIN_ACCESS_KEY || "admin123"; // fallback in dev

    // Check if key is passed in query param
    const queryKey = url.searchParams.get("key");

    if (queryKey === adminKey) {
      // Key is valid! Set session cookie and redirect to clean URL
      const response = NextResponse.redirect(new URL(path, request.url));
      response.cookies.set("admin_session", adminKey, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      return response;
    }

    // Check if valid cookie exists
    const cookieKey = request.cookies.get("admin_session")?.value;
    if (cookieKey !== adminKey) {
      // Unauthorized! Redirect to login page
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
