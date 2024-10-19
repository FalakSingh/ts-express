import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ErrorRes } from '../helpers/api-response';

const validateRequest = (schema: Joi.Schema) => async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    next(new ErrorRes(400, error.details.map((detail) => detail.message).join(', ')));
  } else {
    req.body = value;
    next();
  }
};

export default validateRequest;
