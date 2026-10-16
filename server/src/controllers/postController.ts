import { Request, Response } from "express";
import { z } from "zod";
import { Post } from "../models/Post";
import { AppError } from "../utils/AppError";

const postSchema = z.object({
  title: z.string().trim().min(4).max(160),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().min(10).max(320),
  content: z.string().min(1),
  coverImage: z.string().url().or(z.literal("")).optional(),
  category: z.string().trim().min(2).max(60),
  tags: z.array(z.string().trim().min(1).max(30)).max(12).default([]),
  difficulty: z
    .enum(["Beginner", "Intermediate", "Advanced"])
    .default("Beginner"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  seoTitle: z.string().max(160).default(""),
  seoDescription: z.string().max(320).default(""),
});

const readingTime = (content: string): number =>
  Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));

export const listPublicPosts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(24, Math.max(1, Number(req.query.limit) || 9));
  const search =
    typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : "";
  const category =
    typeof req.query.category === "string" ? req.query.category.trim() : "";
  const filter: Record<string, unknown> = { status: "published" };
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };
  const [posts, total] = await Promise.all([
    Post.find(filter)
      .select("-content")
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
  ]);
  res.json({
    data: posts,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};

export const getPublicPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const post = await Post.findOne({
    slug: req.params.slug,
    status: "published",
  }).lean();
  if (!post) throw new AppError("Article not found.", 404, "POST_NOT_FOUND");
  res.json({ data: post });
};

export const listAdminPosts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const filter: Record<string, unknown> = {};
  if (["draft", "published", "archived"].includes(String(req.query.status)))
    filter.status = req.query.status;
  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
  ]);
  res.json({
    data: posts,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};

export const createPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success)
    throw new AppError(
      parsed.error.issues[0]?.message || "Invalid article data.",
      400,
      "VALIDATION_ERROR",
    );
  const payload = parsed.data;
  const post = await Post.create({
    ...payload,
    readingTime: readingTime(payload.content),
    publishedAt: payload.status === "published" ? new Date() : undefined,
  });
  res.status(201).json({ data: post });
};

export const updatePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  ``;
  const parsed = postSchema.partial().safeParse(req.body);
  if (!parsed.success)
    throw new AppError(
      parsed.error.issues[0]?.message || "Invalid article data.",
      400,
      "VALIDATION_ERROR",
    );
  const update = { ...parsed.data } as Record<string, unknown>;
  if (typeof parsed.data.content === "string")
    update.readingTime = readingTime(parsed.data.content);
  if (parsed.data.status === "published") update.publishedAt = new Date();
  const post = await Post.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!post) throw new AppError("Article not found.", 404, "POST_NOT_FOUND");
  res.json({ data: post });
};

export const deletePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) throw new AppError("Article not found.", 404, "POST_NOT_FOUND");
  res.json({ data: { message: "Article deleted." } });
};

export const dashboardStats = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const [totalPosts, publishedPosts, drafts, projects] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ status: "published" }),
    Post.countDocuments({ status: "draft" }),
    (await import("../models/Project.js")).Project.countDocuments(),
  ]);
  res.json({ data: { totalPosts, publishedPosts, drafts, projects } });
};
