import { NextResponse } from "next/server";
import { fetchCertifications } from "@/lib/db";

export async function GET() {
  try {
    const certifications = await fetchCertifications();
    return NextResponse.json({ success: true, certifications });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
