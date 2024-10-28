import { NextFunction, Request, Response } from 'express';
import { IUser } from '@models';

type ExpressHandler<T = void> = (req: Request, res: Response, next: NextFunction) => Promise<T>;

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
