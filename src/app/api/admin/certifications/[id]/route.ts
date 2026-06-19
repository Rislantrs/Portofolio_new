import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import CertificateModel from "@/models/Certificate";
import { verifyAdmin } from "@/lib/auth";

type ParamsProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(request: Request, { params }: ParamsProps) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    await dbConnect();
    const { id } = await params;
    const numericId = parseInt(id, 10);
    
    if (isNaN(numericId)) {
      return NextResponse.json({ success: false, error: "Invalid ID format" }, { status: 400 });
    }
    
    const deletedDoc = await CertificateModel.findOneAndDelete({ id: numericId });
    
    if (!deletedDoc) {
      return NextResponse.json({ success: false, error: "Certification not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Certification deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
