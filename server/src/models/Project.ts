import { Schema, model, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  technologies: string[];
  repositoryUrl: string;
  liveUrl: string;
  featured: boolean;
  status: "draft" | "published";
}
const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    summary: { type: String, required: true, maxlength: 320 },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    technologies: [{ type: String, trim: true }],
    repositoryUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
  },
  { timestamps: true },
);
projectSchema.index({ title: "text", summary: "text", technologies: "text" });
export const Project = model<IProject>("Project", projectSchema);
