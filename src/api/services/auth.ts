import { Admin, IAdmin, IUser, User } from '@models';
import { UserService } from '.';
import { HttpStatus, Messages } from '@constants';
import { ErrorRes } from '@helpers';
import Env from '@env';
import { jwt } from '@utils';
import { JwtPayload } from 'jsonwebtoken';

// User Auth Services


const resetPassword = async (data: { resetToken: string; password: string }): Promise<void> => {
  const decoded = jwt.verify(data.resetToken, Env.RESET_TOKEN_SECRET);
  const { id } = decoded as JwtPayload;
  const user = await User.findById(id);
  user.password = data.password.trim();
  await user.save();
};

// Admin Auth Services
const createSuperAdmin = async () => {
  if (await Admin.superAdminExists()) throw new ErrorRes(HttpStatus.badRequest, Messages.adminExists);

  await Admin.create({
    email: Env.ADMIN_EMAIL,
    password: Env.ADMIN_PASSWORD,
  });
};

const adminLogin = async (data: { email: string; password: string }) => {
  const email = data.email.toLowerCase();
  const password = data.password;

  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) throw new ErrorRes(HttpStatus.badRequest, Messages.adminDoesntExists);

  const passcheck = await admin.checkPass(password);

  if (!passcheck) throw new ErrorRes(HttpStatus.badRequest, Messages.invalidCredentials);

  const token = admin.getJwt();

  const adminObj: IAdmin & { token: string } = admin.toObject();
  delete adminObj.password;

  adminObj.token = token;

  return adminObj;
};

export { createSuperAdmin, adminLogin, resetPassword };
