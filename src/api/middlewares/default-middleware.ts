import { ExpressHandler } from '../types/express';

export const defaultMiddleware: ExpressHandler = async (req, res, next) => {
  next();
};
