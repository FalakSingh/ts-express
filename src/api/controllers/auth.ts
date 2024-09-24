import { HttpStatus, Messages } from "@constants";
import { successRes } from "@helpers";
import { AuthService, UserService } from "@services";
import { ExpressHandler } from "types/express";

const register: ExpressHandler = async (req, res) => {
  const user = await UserService.create(req.body);
  return successRes(res, HttpStatus.ok, Messages.userRegister, user);
};

const login: ExpressHandler = async (req, res) => {
  const user = await AuthService.login(req.body);
  return successRes(res, HttpStatus.ok, Messages.loggedIn, user);
};

const forgotPassword: ExpressHandler = async (req, res) => {
  await AuthService.forgotPassword(req.body);
  return successRes(res, HttpStatus.ok, "OTP sent successfully");
};

const createSuperAdmin: ExpressHandler = async (req, res) => {
  await AuthService.createSuperAdmin();
  return successRes(res, HttpStatus.ok, Messages.adminCreated);
};

const adminLogin: ExpressHandler = async (req, res) => {
  const admin = await AuthService.adminLogin(req.body);
  return successRes(res, HttpStatus.ok, Messages.loggedIn, admin);
};

export { register, createSuperAdmin, login, adminLogin, forgotPassword };
