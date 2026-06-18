import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Force HTTPS in production to avoid cookie storage and transport rejection on HTTP
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") !== "https"
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get("host")}${request.nextUrl.pathname}${request.nextUrl.search}`
    );
  }

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
        path: "/",
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
