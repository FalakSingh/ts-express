import { Admin, IAdmin, IUser, User } from "@models";
import { UserService } from ".";
import { HttpStatus, Messages } from "@constants";
import { ErrorRes } from "@helpers";
import Env from "@env";

const register = async (data: Partial<IUser>) => {
  return await UserService.create(data);
};

const login = async (data: { email: string; password: string }) => {
  const email = data.email.toLowerCase();
  const password = data.password;

  const user = await User.findByEmail(email);

  if (!user) throw new ErrorRes(HttpStatus.badRequest, Messages.invalidEmail);

  if (user.isDeactivated)
    throw new ErrorRes(HttpStatus.badRequest, Messages.isDeactivated);

  const passCheck = await user.checkPass(password);
  if (!passCheck)
    throw new ErrorRes(HttpStatus.badRequest, Messages.invalidCredentials);

  const token = user.getAccessToken();

  const userObj: IUser & { token: string } = user.toObject();
  delete userObj.password;
  userObj.token = token;

  return userObj;
};

const createSuperAdmin = async () => {
  if (await Admin.superAdminExists())
    throw new ErrorRes(HttpStatus.badRequest, Messages.adminExists);

  await Admin.create({
    email: Env.ADMIN_EMAIL,
    password: Env.ADMIN_PASSWORD,
  });
};

const adminLogin = async (data: { email: string; password: string }) => {
  const email = data.email.toLowerCase();
  const password = data.password;

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin)
    throw new ErrorRes(HttpStatus.badRequest, Messages.adminDoesntExists);

  const passcheck = await admin.checkPass(password);

  if (!passcheck)
    throw new ErrorRes(HttpStatus.badRequest, Messages.invalidCredentials);

  const token = admin.getJwt();

  const adminObj: IAdmin & { token: string } = admin.toObject();
  delete adminObj.password;

  adminObj.token = token;

  return adminObj;
};

const forgotPassword = async (data: { email: string }) => {
  const user = await User.findByEmail(data.email.toLowerCase());
  if (!user) throw new ErrorRes(400, Messages.invalidEmail);

  const otp = await user.getOtp();

  return otp;
};

export { register, login, createSuperAdmin, adminLogin, forgotPassword };
