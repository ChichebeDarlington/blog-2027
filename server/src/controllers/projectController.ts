import { Request, Response } from "express";
import { z } from "zod";
import { Project } from "../models/Project";
import { AppError } from "../utils/AppError";

const projectSchema = z.object({
  title: z.string().trim().min(3).max(140),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().trim().min(10).max(320),
  content: z.string().min(1),
  coverImage: z.string().url().or(z.literal("")).optional(),
  technologies: z.array(z.string().trim().min(1).max(40)).max(15).default([]),
  repositoryUrl: z.string().url().or(z.literal("")).default(""),
  liveUrl: z.string().url().or(z.literal("")).default(""),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const listPublicProjects = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const projects = await Project.find({ status: "published" })
    .sort({ featured: -1, updatedAt: -1 })
    .lean();
  res.json({ data: projects });
};

export const getPublicProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const project = await Project.findOne({
    slug: req.params.slug,
    status: "published",
  }).lean();
  if (!project)
    throw new AppError("Project not found.", 404, "PROJECT_NOT_FOUND");
  res.json({ data: project });
};

export const listAdminProjects = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const projects = await Project.find().sort({ updatedAt: -1 }).lean();
  res.json({ data: projects });
};

export const createProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success)
    throw new AppError(
      parsed.error.issues[0]?.message || "Invalid project data.",
      400,
      "VALIDATION_ERROR",
    );
  const project = await Project.create(parsed.data);
  res.status(201).json({ data: project });
};

export const updateProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const parsed = projectSchema.partial().safeParse(req.body);
  if (!parsed.success)
    throw new AppError(
      parsed.error.issues[0]?.message || "Invalid project data.",
      400,
      "VALIDATION_ERROR",
    );
  const project = await Project.findByIdAndUpdate(req.params.id, parsed.data, {
    new: true,
    runValidators: true,
  });
  if (!project)
    throw new AppError("Project not found.", 404, "PROJECT_NOT_FOUND");
  res.json({ data: project });
};

export const deleteProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project)
    throw new AppError("Project not found.", 404, "PROJECT_NOT_FOUND");
  res.json({ data: { message: "Project deleted." } });
};
