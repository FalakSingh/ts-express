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

// Basic schemas
const createUserSchema = Joi.object({
  firstName: nameSchema('First name'),
  lastName: nameSchema('Last name'),
  email: emailSchema,
  password: passwordSchema,
  image: Joi.string().required().messages({
    'any.required': 'Image is required',
  }),
  emiratesId: Joi.string().required().messages({
    'any.required': 'Emirates Id is required',
  }),
  dob: Joi.string().required().messages({ 'any.required': 'DOB is required' }),
  countryCode: Joi.string().required().messages({ 'any.required': 'Country code is required' }),
  phoneNumber: Joi.string().min(7).max(10).required().messages({
    'string.min': 'Phone Number should have a minimum length of {#limit}',
    'string.max': 'Phone Number should have a maximum length of {#limit}',
    'any.required': 'Phone Number is required',
  }),
});

const loginUserSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

const forgotPasswordSchema = Joi.object({
  email: emailSchema,
});

const verifyOtpSchema = forgotPasswordSchema.keys({
  otp: Joi.string().trim().required().messages({
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

// Validate functions
const forgotPassword = validateRequest(forgotPasswordSchema);
const createUser = validateRequest(createUserSchema);
const userLogin = validateRequest(loginUserSchema);
const verifyOtp = validateRequest(verifyOtpSchema);
const resetPassword = validateRequest(resetPasswordSchema);

export { forgotPassword, createUser, userLogin, verifyOtp, resetPassword };
