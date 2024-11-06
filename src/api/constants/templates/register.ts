import Env from '@env';

export const register = ({ username, otp }: Record<string, string>) => {
  return `
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
        <h1 style="color: #333;">Welcome, ${username}</h1>
        <p style="color: #555; line-height: 1.6;">Thank you for registering with us! We're excited to have you on board.</p>
        <p style="color: #555; line-height: 1.6;">Please verify your account using the One-Time Password (OTP) below:</p>
        <div style="background-color: #f0f0f0; border: 1px solid #ddd; padding: 10px; font-weight: bold; font-size: 18px; text-align: center; border-radius: 4px; margin: 20px 0;">
            ${otp}
        </div>
        <p style="color: #555; line-height: 1.6;">Enter this OTP in the application to complete your registration.</p>
        <p style="color: #555; line-height: 1.6;">If you did not request this registration, please ignore this email.</p>
        <p style="color: #555; line-height: 1.6;">Thank you!</p>
    </div>
    <div style="text-align: center; font-size: 12px; color: #aaa; margin-top: 20px;">
        <p>&copy; 2024 ${Env.PROJECT_NAME}. All rights reserved.</p>
    </div>
</body>
`;
};
