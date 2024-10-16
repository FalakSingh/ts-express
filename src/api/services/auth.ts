import { Admin, IAdmin, IUser, User } from '@models';
import { UserService } from '.';
import { HttpStatus, Messages } from '@constants';
import { ErrorRes } from '@helpers';
import Env from '@env';
import { jwt } from '@utils';
import { JwtPayload } from 'jsonwebtoken';

// User Auth Services

const login = async (data: { email: string; password: string }) => {
  const email = data.email.toLowerCase();
  const password = data.password;

  const user = await User.findByEmail(email);

  if (!user) throw new ErrorRes(HttpStatus.badRequest, Messages.invalidEmail);

  if (!user.isEmailVerified) throw new ErrorRes(HttpStatus.badRequest, Messages.otpNotVerified);

  if (user.isDeactivated) throw new ErrorRes(HttpStatus.badRequest, Messages.isDeactivated);

  const passCheck = await user.checkPass(password);
  if (!passCheck) throw new ErrorRes(HttpStatus.badRequest, Messages.invalidCredentials);

  const token = user.getAccessToken();

  const userObj: IUser & { token: string } = user.toObject();
  delete userObj.password;
  userObj.token = token;

  return userObj;
};
const forgotPassword = async ({ email }: { email: string }) => {
  const user = await User.findByEmail(email.toLowerCase());

  if (!user) throw new ErrorRes(404, "User with this email doesn't exist");

  user.getOtp();

  await user.save();
  return { otp: user.otp };
};

const verifyOtp = async (data: { email: string; otp: string }): Promise<IUser> => {
  const user = await User.findByEmail(data.email.toLowerCase());

  if (!user) throw new ErrorRes(400, 'Something went wrong, Please try again.');

  const isVerified = await user.verifyOtp(data.otp);

  if (!isVerified) throw new ErrorRes(400, Messages.otpIncorrect);
  return user;
};

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

export { login, createSuperAdmin, adminLogin, forgotPassword, verifyOtp, resetPassword };
