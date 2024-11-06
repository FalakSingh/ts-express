import { IRouter } from 'express';
import { catchAsync, defaultMiddleware } from '@middlewares';
import { ExpressHandler } from 'types/express';
import { TRoute } from 'types/routes';

export const generateRoutes = (routes: Array<TRoute>, router: IRouter) => {
  routes.forEach(({ path, method, handler, middleware = [defaultMiddleware] }) =>
    router[method](path, middleware, catchAsync(<ExpressHandler>handler))
  );
};
