import { ExpressHandler } from "../types/express";

export const catchAsync =
  (handler: ExpressHandler): ExpressHandler =>
  async (req, res, next) =>
    handler(req, res, next).catch(next);


