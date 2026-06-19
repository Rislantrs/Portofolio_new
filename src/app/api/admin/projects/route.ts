import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    await dbConnect();
    const list = await Project.find({}).sort({ id: 1 }).lean();
    return NextResponse.json({ success: true, projects: JSON.parse(JSON.stringify(list)) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    await dbConnect();
    const body = await request.json();
    
    const projectData = { ...body };
    
    // Jika id negatif (dibuat sementara di UI) atau tidak ada, tandanya item baru
    if (!projectData.id || projectData.id < 0) {
      const maxProject = await Project.findOne({}).sort({ id: -1 }).select("id").lean();
      const nextId = maxProject && typeof maxProject.id === "number" ? maxProject.id + 1 : 1;
      projectData.id = nextId;
      
      // Pastikan slug unik
      const existingProjectWithSlug = await Project.findOne({ slug: projectData.slug }).lean();
      if (existingProjectWithSlug) {
        projectData.slug = `${projectData.slug}-${nextId}`;
      }
      
      const newDoc = await Project.create(projectData);
      return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(newDoc)) });
    } else {
      // Pembaruan data lama
      const updatedDoc = await Project.findOneAndUpdate(
        { id: projectData.id },
        { $set: projectData },
        { new: true, runValidators: true }
      ).lean();
      
      if (!updatedDoc) {
        return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(updatedDoc)) });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
