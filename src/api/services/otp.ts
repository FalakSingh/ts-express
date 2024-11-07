import { Otp } from '@models';
import { sendEmail } from '@utils';
import { TSendEmailPayload } from 'types/payload';

const findOtpByEmail = async (email: string) => await Otp.findByEmail(email);

const setOtpIfDoesntExist = async (email: string, setOtpFor: TSendEmailPayload['type'] = 'register') => {
  const otpExists = await Otp.findByEmail(email);
  if (!otpExists) {
    const otpObj = await Otp.setOtp(email);
    sendEmail({ type: setOtpFor, email, data: { otp: otpObj.otp } });
    return otpObj.otp;
  }
  return otpExists.otp;
};

const deleteOtpByEmail = async (email: string) => await Otp.deleteOtp(email);

const resetOtp = async (email: string) => {
  await Otp.deleteOtp(email);
  return await setOtpIfDoesntExist(email);
};

export { setOtpIfDoesntExist, resetOtp, findOtpByEmail, deleteOtpByEmail };
