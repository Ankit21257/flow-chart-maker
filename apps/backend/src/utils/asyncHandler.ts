import type { Request, Response, NextFunction } from "express";

const asyncHandler = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error); 
    }
  };
};

export default asyncHandler;
