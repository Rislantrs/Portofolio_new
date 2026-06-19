import mongoose, { Schema, Document, Model } from "mongoose";
import { Certificate } from "@/lib/certifications";

export interface ICertificateDocument extends Omit<Certificate, "_id">, Document {}

const CertificateSchema = new Schema<ICertificateDocument>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  organizer: { type: String, required: true },
  year: { type: String, required: true },
  category: { type: String, required: true, enum: ["ai", "cloud", "network", "web"] },
  badgeName: { type: String, required: true },
  badgeIcon: { type: String, required: true },
  link: { type: String }
}, {
  timestamps: true
});

const CertificateModel: Model<ICertificateDocument> = mongoose.models.Certificate || mongoose.model<ICertificateDocument>("Certificate", CertificateSchema);

export default CertificateModel;
