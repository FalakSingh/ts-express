import { NextFunction, Request, Response } from "express";

type ExpressHandler<T = void> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>;
