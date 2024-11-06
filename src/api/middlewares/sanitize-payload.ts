import { ExpressHandler } from 'types/express';

const sanitizePayload: ExpressHandler = async (req, res, next) => {
  const sensitiveFields = ['email', 'password'];

  sensitiveFields.forEach((field) => {
    if (req.body.hasOwnProperty(field)) {
      delete req.body[field];
    }
  });

  next();
};

export { sanitizePayload };
