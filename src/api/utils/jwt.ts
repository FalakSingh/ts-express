import { ErrorRes } from '@helpers';
import jwt, { JwtPayload } from 'jsonwebtoken';

const create = (data: { [key: string]: any }, secret: string, expires: string) => {
  return jwt.sign(data, secret, {
    expiresIn: expires,
  });
};

const verify = (token: string, secret: string): string | JwtPayload => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded as string | JwtPayload;
  } catch (error) {
    throw new ErrorRes(400, `Invalid Token, Reason: ${error.message}`);
  }
};

export { create, verify };
