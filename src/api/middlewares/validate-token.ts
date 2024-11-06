import { NextFunction, Request, Response } from 'express';
import { ErrorRes } from '../helpers/api-response';
import { HttpStatus, Messages } from '@constants';
import { jwt } from '@utils';
import Env from '@env';
import { JwtPayload } from 'jsonwebtoken';
import { UserService } from '@services';
import { IUser } from '../models/user';

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let authorizationToken = req.headers.authorization;
    if (!authorizationToken) throw new ErrorRes(HttpStatus.unauthorized, Messages.unauthorized);

    let [bearerString, token] = authorizationToken.split(' ');

    if (bearerString !== 'Bearer') throw new ErrorRes(HttpStatus.unauthorized, Messages.invalidToken);

    const decoded = <JwtPayload>jwt.verify(token, Env.ACCESS_TOKEN_SECRET);

    const user = await UserService.findUser.byId(decoded.id);

    if (!user) throw new ErrorRes(HttpStatus.unauthorized, Messages.unauthorized);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export { validateToken };
