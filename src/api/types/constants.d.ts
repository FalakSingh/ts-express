export type HttpStatusTypes = {
  serverError: number;
  unauthorized: number;
  badRequest: number;
  forbidden: number;
  notFound: number;
  ok: number;
};

export type MessagesTypes = {
  serverError: string;
  badRequest: string;
  notFound: string;
  unauthorized: string;
  invalidToken: string;
  forbidden: string;
  fetched: string;
  emailExists: string;
  invalidCredentials: string;
  otpNotVerified: string;
  isDeactivated: string;
  userRegister: string;
  loggedIn: string;
  invalidEmail: string;
  adminCreated: string;
  adminExists: string;
  adminDoesntExists: string;
  otpExpired: string;
  emailNotVerified: string;
  otpSent: string;
  otpIncorrect: string;
  otpVerified: string;
  passwordReset: string;
  logout: string;
  update: (type: string) => string;
  create: (type: string) => string;
  delete: (type: string) => string;
  details: (type: string) => string;
};
