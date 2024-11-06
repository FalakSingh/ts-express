import Joi from 'joi';

// Common string messages
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

export { stringMessages, nameSchema, emailSchema, passwordSchema };
