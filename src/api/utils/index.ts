const generateOtp = (otpLength: number): string => {
  let otp: string = '';
  for (let i = 0; i < otpLength; i++) {
    otp += String(Math.floor(Math.random() * 10));
  }
  return otp;
};

export * as jwt from './jwt';
export { generateOtp };
