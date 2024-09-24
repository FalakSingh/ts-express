import { AuthController } from '@controllers';
import { filehandler, upload } from '@helpers';
import { catchAsync, defaultMiddleware } from '@middlewares';
import { AuthValidation } from '@validations';
import { Router } from 'express';
import { ExpressHandler } from 'types/express';

const authRouter = Router();

const authRoutes = [
  {
    path: '/register',
    method: 'post',
    handler: AuthController.register,
    middleware: [upload, filehandler, AuthValidation.createUser],
  },
  {
    path: "/login",
    method: "post",
    handler: AuthController.login,
    middleware: [AuthValidation.userLogin],
  },
  {
    path: "/forgot-password",
    method: "post",
    handler: AuthController.forgotPassword,
    middleware: [AuthValidation.forgotPassword],
  },
  {
    path: "/create-super-admin",
    method: "get",
    handler: AuthController.createSuperAdmin,
  },
  {
    path: "/admin-login",
    method: "post",
    handler: AuthController.adminLogin,
    middleware: [AuthValidation.userLogin],
  },
];

authRoutes.forEach(({ path, method, handler, middleware = [defaultMiddleware] }) =>
  (authRouter as any)[method](
    path,
    middleware,
    catchAsync(handler as ExpressHandler)
  )
);

export { authRouter };
