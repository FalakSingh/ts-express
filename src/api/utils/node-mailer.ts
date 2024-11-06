import Env from '@env';
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
  try {
    const info = await transporter.sendMail({
      from: Env.SMTP.FROM,
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    throw new Error(error.message);
  }
}

export { send };
