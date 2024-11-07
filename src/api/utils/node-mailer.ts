import { HttpStatus } from '@constants';
import Env from '@env';
import { ErrorRes } from '@helpers';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: Env.SMTP.HOST,
  port: Env.SMTP.PORT,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: Env.SMTP.USERNAME,
    pass: Env.SMTP.PASSWORD,
  },
} as nodemailer.TransportOptions);

async function send({ to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: Env.SMTP.FROM,
    to,
    subject,
    text,
    html,
  });
  console.log('Message sent: %s', info.messageId);
}

export { send };
