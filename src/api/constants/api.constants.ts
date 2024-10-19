import { HttpStatusTypes, MessagesTypes } from 'types/constants';

export const HttpStatus: HttpStatusTypes = {
  serverError: 500,
  unauthorized: 401,
  badRequest: 400,
  forbidden: 403,
  notFound: 404,
  ok: 200,
};

export const Messages: MessagesTypes = {
  serverError: 'Internal Server Error',
  genericError: 'Something went wrong, Please try again',
  badRequest: 'Bad request',
  notFound: 'Not found',
  unauthorized: 'Unauthorized',
  forbidden: 'Forbidden',
  fetched: 'Data fetched successfully',
  emailExists: 'Email already exists',
  invalidCredentials: 'Invalid Credentials',
  otpNotVerified: 'Please verify your account first',
  isDeactivated: 'Your account has been deactivated by Admin',
  userRegister: 'User Registered Successfully',
  loggedIn: 'Logged in successfully',
  invalidEmail: 'Invalid Email',
  adminCreated: 'Admin created successfully',
  adminExists: 'Admin already exists',
  adminDoesntExists: "Admin doesn't exist",
  otpExpired: 'OTP has been expired',
  emailNotVerified: 'Please verify your email',
  otpSent: 'OTP sent successfully',
  otpIncorrect: 'Incorrect OTP',
  otpVerified: 'OTP verified successfully',
  passwordReset: 'Password reset successfully',
  userDoesntExist: `User with this email doesn't exist`,
};
