import Env from '@env';
import { templates } from '@templates';
import { mail } from '@utils';
import { TSendEmailPayload } from 'types/payload';

const subjects = {
  register: `Welcome to ${Env.PROJECT_NAME}`,
  forgotPass: `Password reset request`,
};

const sendEmail = ({ email, type, data }: TSendEmailPayload) => {
  try {
    mail.send({ to: email, subject: subjects[type], text: '', html: templates[type](data) });
  } catch (error) {
    throw new Error(error.message);
  }
};

export { sendEmail };
