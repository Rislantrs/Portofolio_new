import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { key } = await request.json();
    const adminKey = process.env.ADMIN_ACCESS_KEY || "admin123";

    if (key === adminKey) {
      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_session", adminKey, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });
      return response;
    }

    return NextResponse.json({ success: false, error: "Invalid secret key" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
