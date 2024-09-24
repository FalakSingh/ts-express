import { NextFunction, Request, Response } from 'express';

const filehandler = async (req: Request, res: Response, next: NextFunction) => {
  for (let key in req.files) {
    if (key === 'image') {
      req.body.image = (req.files as any)?.image[0].filename;
    }
  }
  next();
};
export { filehandler };
