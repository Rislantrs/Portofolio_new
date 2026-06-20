import mongoose, { Schema, Document, Model } from "mongoose";
import { ProjectArticle } from "@/lib/projects";

export interface IProjectDocument extends Omit<ProjectArticle, "_id">, Document {}

const ContentBlockSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true, enum: ["heading", "paragraph", "image", "list", "links"] },
  level: { type: Number },
  text: { type: String },
  src: { type: String },
  alt: { type: String },
  caption: { type: String },
  align: { type: String, enum: ["left", "center", "right", "wide"] },
  size: { type: String, enum: ["small", "medium", "large", "full"] },
  items: { type: Schema.Types.Mixed } // Bisa berupa string[] atau { label: string, url: string }[]
}, { _id: false });

const ProjectSchema = new Schema<IProjectDocument>({
  id: { type: Number, required: true, unique: true },
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  shortTitle: { type: String, required: true },
  year: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  image: { type: String, required: true },
  github: { type: String },
  demo: { type: String },
  featured: { type: Boolean, default: false },
  role: { type: String, required: true },
  status: { type: String, required: true, enum: ["draft", "published"], default: "draft" },
  summary: { type: String, required: true },
  content: [ContentBlockSchema]
}, {
  timestamps: true
});

const Project: Model<IProjectDocument> = mongoose.models.Project || mongoose.model<IProjectDocument>("Project", ProjectSchema);

export default Project;
