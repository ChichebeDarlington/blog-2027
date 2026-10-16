import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.[env.COOKIE_NAME];
    if (!token)
      return next(
        new AppError("Please sign in to continue.", 401, "UNAUTHENTICATED"),
      );
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    if (!payload.sub)
      return next(new AppError("Invalid session.", 401, "INVALID_SESSION"));
    const user = await User.findById(payload.sub).select("_id isActive role");
    if (!user || !user.isActive || user.role !== "admin")
      return next(
        new AppError("Administrator access required.", 401, "UNAUTHENTICATED"),
      );
    req.userId = user.id;
    next();
  } catch {
    next(
      new AppError(
        "Your session is invalid or expired. Please sign in again.",
        401,
        "INVALID_SESSION",
      ),
    );
  }
};
