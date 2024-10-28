import { Otp } from '@models';
import { sendEmail } from '@utils';

const findOtpByEmail = async (email: string) => await Otp.findByEmail(email);
const setOtpIfDoesntExist = async (email: string, setOtpFor = 'forRegister') => {
  const otpExists = await Otp.findByEmail(email);
  if (!otpExists) {
    const otpObj = await Otp.setOtp(email);
    sendEmail[setOtpFor]({ email, otp: otpObj.otp });
    return otpObj.otp;
  }
  return otpExists.otp;
};

const deleteOtpByEmail = async (email: string) => await Otp.deleteOtp(email);

const resetOtp = async (email: string) => {
  await Otp.deleteOtp(email);
  await Otp.setOtp(email);
};

export { setOtpIfDoesntExist, resetOtp, findOtpByEmail, deleteOtpByEmail };
