import { HttpStatus, Messages } from '@constants';
import { ErrorRes, successRes } from '@helpers';
import { IUser } from '@models';
import { AuthService, UserService } from '@services';
import { ExpressHandler } from 'types/express';

const register: ExpressHandler = async (req, res) => {
  const payload = { ...req.body };
  const email = payload.email;
  const emailExists = UserService.checkIfEmailIsVerified(email);

  if (emailExists) throw new ErrorRes(HttpStatus.badRequest, Messages.emailExists);

  const userObj = await UserService.findUserByEmail(email);
  if (!userObj.isEmailVerified) await UserService.deleteUser.hard(userObj.id);

  const user = await UserService.create(payload);
  return successRes(res, HttpStatus.ok, Messages.userRegister, user);
};

const login: ExpressHandler = async (req, res) => {
  const payload = { ...req.body };

  const { email, password } = payload;

  const user = await UserService.findUserByEmail(email);

  if (!user) throw new ErrorRes(HttpStatus.badRequest, Messages.invalidEmail);

  if (!user.isEmailVerified) throw new ErrorRes(HttpStatus.badRequest, Messages.otpNotVerified);

  if (user.isDeactivated) throw new ErrorRes(HttpStatus.badRequest, Messages.isDeactivated);

  if (!(await user.checkPass(password))) throw new ErrorRes(HttpStatus.badRequest, Messages.invalidCredentials);

  const token = user.getAccessToken();

  const userObj: IUser & { token: string } = user.toObject();
  delete userObj.password;
  userObj.token = token;

  return successRes(res, HttpStatus.ok, Messages.loggedIn, userObj);
};

const forgotPassword: ExpressHandler = async (req, res) => {
  const { email } = req.body;
  const user = await UserService.findUserByEmail(email);
  if (!user) throw new ErrorRes(HttpStatus.notFound, Messages.userDoesntExist);
  user.getOtp();
  await user.save();
  return successRes(res, HttpStatus.ok, Messages.otpSent, { otp: user.otp });
};

const verifyOtp: ExpressHandler = async (req, res) => {
  const { email, otp } = req.body;
  const user = await UserService.findUserByEmail(email);
  if (!user) throw new ErrorRes(HttpStatus.badRequest, Messages.genericError);
  const isVerified = await user.verifyOtp(otp);
  if (!isVerified) throw new ErrorRes(400, Messages.otpIncorrect);
  return successRes(res, HttpStatus.ok, Messages.otpVerified);
};

const resetPassword: ExpressHandler = async (req, res) => {
  await AuthService.resetPassword(req.body);
  return successRes(res, HttpStatus.ok, Messages.passwordReset);
};
const createSuperAdmin: ExpressHandler = async (req, res) => {
  await AuthService.createSuperAdmin();
  return successRes(res, HttpStatus.ok, Messages.adminCreated);
};

const adminLogin: ExpressHandler = async (req, res) => {
  const admin = await AuthService.adminLogin(req.body);
  return successRes(res, HttpStatus.ok, Messages.loggedIn, admin);
};

export { register, createSuperAdmin, login, adminLogin, forgotPassword, verifyOtp, resetPassword };
