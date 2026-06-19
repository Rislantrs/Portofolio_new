import { cookies } from "next/headers";

export async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const adminKey = process.env.ADMIN_ACCESS_KEY || "admin123";
  return session === adminKey;
}
