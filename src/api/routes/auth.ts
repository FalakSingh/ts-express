import { AuthController } from '@controllers';
import { filehandler, upload } from '@helpers';
import { catchAsync, defaultMiddleware, validateToken } from '@middlewares';
import { AuthValidation } from '@validations';
import { Router } from 'express';
import { ExpressHandler } from 'types/express';

const authRouter = Router();

const authRoutes = [
  {
    path: '/register',
    method: 'post',
    handler: AuthController.user.register,
    middleware: [AuthValidation.createUser],
  },
  {
    path: '/verify-otp',
    method: 'post',
    handler: AuthController.user.verifyOtp,
    middleware: [AuthValidation.verifyOtp],
  },
  {
    path: '/login',
    method: 'post',
    handler: AuthController.user.login,
    middleware: [AuthValidation.userLogin],
  },
  {
    path: '/forgot-password',
    method: 'post',
    handler: AuthController.user.forgotPassword,
    middleware: [AuthValidation.forgotPassword],
  },
  {
    path: '/reset-password',
    method: 'patch',
    handler: AuthController.user.resetPassword,
    middleware: [AuthValidation.resetPassword],
  },
  {
    path: '/logout',
    method: 'patch',
    handler: AuthController.user.logout,
    middleware: [AuthValidation.logout, validateToken],
  },
  {
    path: '/create-super-admin',
    method: 'get',
    handler: AuthController.admin.createSuperAdmin,
  },
  {
    path: '/admin/login',
    method: 'post',
    handler: AuthController.admin.adminLogin,
    middleware: [AuthValidation.userLogin],
  },
];

authRoutes.forEach(({ path, method, handler, middleware = [defaultMiddleware] }) =>
  (authRouter as any)[method](path, middleware, catchAsync(handler as ExpressHandler))
);

export { authRouter };
