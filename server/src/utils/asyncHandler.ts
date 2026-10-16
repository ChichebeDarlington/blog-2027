import { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandler = (handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
