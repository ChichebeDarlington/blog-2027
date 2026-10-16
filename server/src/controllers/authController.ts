import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import "../middleware/auth";

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(200),
});

const cookieOptions = () =>
  ({
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: "/",
    maxAge: 1000 * 60 * 60 * 8,
  }) as const;

export const login = async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success)
    throw new AppError(
      "Enter a valid email and password.",
      400,
      "VALIDATION_ERROR",
    );
  const email = parsed.data.email.toLowerCase().trim();
  const user = await User.findOne({ email }).select("+passwordHash");
  if (
    !user ||
    !user.isActive ||
    !(await bcrypt.compare(parsed.data.password, user.passwordHash))
  ) {
    throw new AppError(
      "Email or password is incorrect.",
      401,
      "INVALID_CREDENTIALS",
    );
  }
  const token = jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: "8h",
  });
  user.lastLoginAt = new Date();
  await user.save();
  res.cookie(env.COOKIE_NAME, token, cookieOptions());
  res.status(200).json({
    data: { user: { id: user.id, email: user.email, role: user.role } },
  });
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: "/",
  });
  res.status(200).json({ data: { message: "Signed out successfully." } });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.userId).select("email role lastLoginAt");
  if (!user)
    throw new AppError(
      "Administrator account not found.",
      404,
      "USER_NOT_FOUND",
    );
  res.status(200).json({
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
      },
    },
  });
};
