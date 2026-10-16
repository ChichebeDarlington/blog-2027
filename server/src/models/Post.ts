import { Schema, model, Document } from "mongoose";

export type PostStatus = "draft" | "published" | "archived";
export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: PostStatus;
  featured: boolean;
  readingTime: number;
  publishedAt?: Date;
  seoTitle: string;
  seoDescription: string;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: { type: String, required: true, maxlength: 320 },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    category: { type: String, required: true, trim: true, index: true },
    tags: [{ type: String, trim: true }],
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    featured: { type: Boolean, default: false },
    readingTime: { type: Number, default: 1, min: 1 },
    publishedAt: { type: Date },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true },
);

postSchema.index({
  title: "text",
  excerpt: "text",
  content: "text",
  tags: "text",
});
export const Post = model<IPost>("Post", postSchema);
