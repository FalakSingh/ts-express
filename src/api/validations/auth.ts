import Joi from 'joi';
import validateRequest from './validate';

// Common messages
const stringMessages = (field: string) => ({
  'string.base': `${field} must be a string`,
  'string.empty': `${field} is required`,
  'any.required': `${field} is required`,
});

// Schema for user details (first name, last name)
const nameSchema = (field: string) =>
  Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      ...stringMessages(field),
      'string.min': `${field} should have a minimum length of {#limit}`,
      'string.max': `${field} should have a maximum length of {#limit}`,
    });

// Email validation
const emailSchema = Joi.string()
  .lowercase()
  .trim()
  .email()
  .required()
  .messages({
    ...stringMessages('Email'),
    'string.email': 'Email must be a valid email',
  });

// Password validation
const passwordSchema = Joi.string()
  .trim()
  .min(8)
  .required()
  .messages({
    ...stringMessages('Password'),
    'string.min': 'Password should have a minimum length of {#limit}',
  });

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
  username: nameSchema('User Name'),
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

const verifyOtpSchema = forgotPasswordSchema.keys({
  email: emailSchema,
  type: Joi.string().optional(),
  otp: Joi.string().trim().length(4).required().messages({
    'string.length': 'Invalid OTP, must be 4 characters long', // Custom message for length validation
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
const createUser = validateRequest(createUserSchema);
const userLogin = validateRequest(loginUserSchema);
const verifyOtp = validateRequest(verifyOtpSchema);
const resetPassword = validateRequest(resetPasswordSchema);
const logout = validateRequest(logoutSchema);

export { forgotPassword, createUser, userLogin, verifyOtp, resetPassword, logout };
