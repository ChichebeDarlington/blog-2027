import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const notFound = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(
    new AppError(
      `Route not found: ${req.method} ${req.originalUrl}`,
      404,
      "NOT_FOUND",
    ),
  );
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json({ error: { code: error.code, message: error.message } });
    return;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    res
      .status(409)
      .json({
        error: {
          code: "DUPLICATE_VALUE",
          message: "A record with this value already exists.",
        },
      });
    return;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "ValidationError"
  ) {
    res
      .status(400)
      .json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Please check the submitted fields.",
        },
      });
    return;
  }
  console.error(error);
  res
    .status(500)
    .json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong. Please try again.",
      },
    });
};
