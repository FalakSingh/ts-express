import { HttpStatus, Messages } from '@constants';
import { ErrorRes, successRes } from '@helpers';
import { AdminService, OtpService, UserService } from '@services';
import { ExpressHandler } from 'types/express';
import { IAdmin, IUser, User } from '@models';
import { jwt } from '@utils';
import Env from '@env';
import { JwtPayload } from 'jsonwebtoken';

const register: ExpressHandler = async (req, res) => {
  const payload = { ...req.body };
  const { email, deviceToken, deviceId, deviceType } = payload;

  const emailExists = await UserService.checkIfEmailIsVerified(email);
  if (emailExists) throw new ErrorRes(HttpStatus.badRequest, Messages.emailExists);

  const userObj = await UserService.findUserByEmail(email);
  if (userObj && !userObj?.isEmailVerified) await UserService.deleteUser.hard(userObj.id);

  const otp = await OtpService.setOtpIfDoesntExist(email);
  const user = await UserService.createUser(payload);

  const userToUpdateDeviceToken = await UserService.findUserById(user.id);

  UserService.addUserDevice(user, { deviceToken, deviceId, deviceType });

  await userToUpdateDeviceToken.save();

  return successRes(res, HttpStatus.ok, Messages.userRegister, { ...user, otp });
};

const verifyOtp: ExpressHandler = async (req, res) => {
  const payload = { ...req.body };

  const { email, otp, type } = payload;

  const otpObj = await OtpService.findOtpByEmail(email);
  if (!otpObj) throw new ErrorRes(HttpStatus.badRequest, Messages.invalidEmail);
  const isOtpCorrect = otpObj.checkOtp(otp);

  if (!isOtpCorrect) throw new ErrorRes(HttpStatus.badRequest, Messages.otpIncorrect);

  const user = await UserService.setUserEmailVerified(email);
  await otpObj.deleteOne();

  let token = user[type === 'forgot-pass' ? 'getResetToken' : 'getAccessToken']();

  return successRes(res, HttpStatus.ok, Messages.otpVerified, { token });
};

const login: ExpressHandler = async (req, res) => {
  const { email, password, deviceToken, deviceId, deviceType } = req.body;

  let user = await UserService.findUserByEmail(email);

  if (!user) throw new ErrorRes(HttpStatus.badRequest, Messages.invalidEmail);

  if (!user.isEmailVerified) throw new ErrorRes(HttpStatus.forbidden, Messages.emailNotVerified);

  if (user.isDeactivated) throw new ErrorRes(HttpStatus.badRequest, Messages.isDeactivated);

  const passCheck = await user.checkPass(password);
  if (!passCheck) throw new ErrorRes(HttpStatus.badRequest, Messages.invalidCredentials);

  const token = user.getAccessToken();

  user.updateLastLogin();

  user = UserService.addUserDevice(user, { deviceToken, deviceId, deviceType });

  await user.save();

  const userObj: IUser & { token: string } = user.toObject();
  delete userObj.password;
  userObj.token = token;

  return successRes(res, HttpStatus.ok, Messages.loggedIn, userObj);
};

const forgotPassword: ExpressHandler = async (req, res) => {
  const { email } = req.body;

  const user = await UserService.findUserByEmail(email);

  if (!user) throw new ErrorRes(HttpStatus.badRequest, Messages.invalidEmail);

  const otp = await OtpService.setOtpIfDoesntExist(email, 'forForgotPassword');

  return successRes(res, HttpStatus.ok, Messages.otpSent, { otp });
};

const resetPassword: ExpressHandler = async (req, res) => {
  const { resetToken, password } = req.body;

  const decoded = jwt.verify(resetToken, Env.RESET_TOKEN_SECRET);

  if (decoded) {
    const user = await UserService.findUserById((decoded as JwtPayload).id);
    user.password = password;
    await user.save();
    return successRes(res, HttpStatus.ok, Messages.passwordReset);
  }
};

const logout: ExpressHandler = async (req, res) => {
  const { deviceId } = req.body;
  const user = req.user;
  UserService.removeUserDevice(user, deviceId);
  await user.save();
  return successRes(res, HttpStatus.ok, Messages.logout);
};

// Admin AUTH
const createSuperAdmin: ExpressHandler = async (req, res) => {
  if (AdminService.checkIfSuperAdminExists()) throw new ErrorRes(HttpStatus.badRequest, Messages.adminExists);

  await AdminService.createAdmin();

  return successRes(res, HttpStatus.ok, Messages.adminCreated);
};

const adminLogin: ExpressHandler = async (req, res) => {
  const { email, password } = req.body;

  const admin = await AdminService.findAdminByEmail(email);

  if (!admin) throw new ErrorRes(HttpStatus.badRequest, Messages.adminDoesntExists);

  const passcheck = await admin.checkPass(password);

  if (!passcheck) throw new ErrorRes(HttpStatus.badRequest, Messages.invalidCredentials);

  const token = admin.getJwt();

  const adminObj: IAdmin & { token: string } = admin.toObject();
  delete adminObj.password;

  adminObj.token = token;
  return successRes(res, HttpStatus.ok, Messages.loggedIn, admin);
};

const user = {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  logout,
};
const admin = { createSuperAdmin, adminLogin };

export { user, admin };
