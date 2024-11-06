import { NextFunction, Request, Response } from 'express';
import { IUser } from '@models';
import { Types } from 'mongoose';

type ExpressHandler<T = void> = (req: Request, res: Response, next: NextFunction) => Promise<T>;

type IdType = Types.ObjectId | string;

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
