import Env from '@env';
import { templates } from '@templates';
import { mail } from '@utils';

const forRegister = ({ email, otp }) => {
  mail.sendMail({
    to: email,
    subject: `Welcome to ${Env.PROJECT_NAME}`,
    text: '',
    html: templates.register('', otp),
  });
};
const forForgotPassword = ({ email, otp }) => {
  mail.sendMail({
    to: email,
    subject: `Password reset request`,
    text: '',
    html: templates.forgotPass('', otp),
  });
};

export { forRegister, forForgotPassword };
