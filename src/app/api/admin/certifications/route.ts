import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import CertificateModel from "@/models/Certificate";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    await dbConnect();
    const list = await CertificateModel.find({}).sort({ id: 1 }).lean();
    return NextResponse.json({ success: true, certifications: JSON.parse(JSON.stringify(list)) });
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
    
    const certData = { ...body };
    
    // Jika id negatif (dibuat sementara di UI) atau tidak ada, tandanya item baru
    if (!certData.id || certData.id < 0) {
      const maxCert = await CertificateModel.findOne({}).sort({ id: -1 }).select("id").lean();
      const nextId = maxCert && typeof maxCert.id === "number" ? maxCert.id + 1 : 1;
      certData.id = nextId;
      
      const newDoc = await CertificateModel.create(certData);
      return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(newDoc)) });
    } else {
      // Pembaruan data lama
      const updatedDoc = await CertificateModel.findOneAndUpdate(
        { id: certData.id },
        { $set: certData },
        { new: true, runValidators: true }
      ).lean();
      
      if (!updatedDoc) {
        return NextResponse.json({ success: false, error: "Certification not found" }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(updatedDoc)) });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
