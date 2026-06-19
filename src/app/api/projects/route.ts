import { NextResponse } from "next/server";
import { fetchPublishedProjects } from "@/lib/db";

export async function GET() {
  try {
    const projects = await fetchPublishedProjects();
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
