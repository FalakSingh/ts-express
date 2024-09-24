import { NextFunction, Request, Response } from 'express';
import { ErrorRes } from '@helpers';
import { HttpStatus, Messages } from '@constants';
import Env from '@env';
import logger from '@logger';

export const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (!(err instanceof ErrorRes)) {
    console.log(err);
    err = new ErrorRes(HttpStatus.serverError, Messages.serverError);
  }
  if (Env.NODE_ENV !== 'local') {
    logger.error({ status: err.status, message: err.message });
  }
  return res.status(err.status).json({ status: err.status, message: err.message, data: err.data });
};
