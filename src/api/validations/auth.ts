import Joi from 'joi';
import validateRequest from './validate';
import { emailSchema, nameSchema, passwordSchema, stringMessages } from './common';

const deviceInfoSchema = {
  deviceToken: Joi.string()
    .trim()
    .required()
    .messages({
      ...stringMessages('Device Token'),
    }),
  deviceType: Joi.string()
    .trim()
    .required()
    .valid('iOS', 'Android')
    .messages({
      ...stringMessages('Device Type'),
    }),
  deviceId: Joi.string()
    .trim()
    .required()
    .messages({
      ...stringMessages('Device ID'),
    }),
};

// Basic schemas
const createUserSchema = Joi.object({
  fullName: nameSchema('User Name'),
  email: emailSchema,
  password: passwordSchema,
  ...deviceInfoSchema,
});

const loginUserSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  ...deviceInfoSchema,
});

const forgotPasswordSchema = Joi.object({
  email: emailSchema,
});
const resendOtpSchema = Joi.object({
  email: emailSchema,
});

const verifyOtpSchema = forgotPasswordSchema.keys({
  email: emailSchema,
  type: Joi.string().optional(),
  otp: Joi.string().trim().length(4).required().messages({
    'string.length': 'Invalid OTP, must be 4 characters long',
    'any.required': 'OTP is required',
  }),
});

const resetPasswordSchema = Joi.object({
  resetToken: Joi.string().trim().min(8).required().messages({
    'string.min': 'Reset Token should have a minimum length of {#limit}',
    'any.required': 'Reset Token is required',
  }),
  password: passwordSchema,
});

const logoutSchema = Joi.object({
  deviceId: deviceInfoSchema.deviceId,
});

// Validate functions
const forgotPassword = validateRequest(forgotPasswordSchema);
const resendOtp = validateRequest(resendOtpSchema);
const createUser = validateRequest(createUserSchema);
const userLogin = validateRequest(loginUserSchema);
const verifyOtp = validateRequest(verifyOtpSchema);
const resetPassword = validateRequest(resetPasswordSchema);
const logout = validateRequest(logoutSchema);

export { forgotPassword, resendOtp, createUser, userLogin, verifyOtp, resetPassword, logout };
