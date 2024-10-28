const SMTP = {
  HOST: process.env.SMTP_HOST,
  PORT: process.env.SMTP_PORT,
  USERNAME: process.env.SMTP_USERNAME,
  PASSWORD: process.env.SMTP_PASSWORD,
  FROM: process.env.SMTP_FROM,
};

const Env = {
  PROJECT_NAME: process.env.PROJECT_NAME,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV,
  BASE_URL: process.env.BASE_URL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES,
  RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET,
  RESET_TOKEN_EXPIRES: process.env.RESET_TOKEN_EXPIRES,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  SMTP,
};

export default Env;
