import Env from '@env';
import { templates } from '@templates';
import { mail } from '@utils';

const subjects = {
  register: `Welcome to ${Env.PROJECT_NAME}`,
  forgotPass: `Password reset request`,
};

type TSendEmailPayload = {
  email: string;
  data: Record<string, string>;
  type: 'register' | 'forgotPass';
};
const sendEmail = ({ email, type, data }: TSendEmailPayload) => {
  mail.send({ to: email, subject: subjects[type], text: '', html: templates[type](data) });
};

export { sendEmail };
