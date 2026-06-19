import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import CertificateModel from "@/models/Certificate";
import { projects } from "@/lib/projects";
import { certificates } from "@/lib/certifications";

export async function GET() {
  // Hanya ijinkan di development env demi keamanan
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, message: "Not allowed in production" }, { status: 403 });
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    await dbConnect();
    
    console.log("Clearing existing data...");
    await Project.deleteMany({});
    await CertificateModel.deleteMany({});
    
    console.log("Inserting fallback projects and certificates...");
    const insertedProjects = await Project.insertMany(projects);
    const insertedCertificates = await CertificateModel.insertMany(certificates);
    
    console.log("Database seeded successfully!");
    
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      projectsCount: insertedProjects.length,
      certificatesCount: insertedCertificates.length
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
