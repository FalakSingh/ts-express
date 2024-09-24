import Joi from "joi";
import validateRequest from "./validate";

const createUserSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(50).required().messages({
    "string.base": "Full name must be a string",
    "string.empty": "Full name is required",
    "string.min": "Full name should have a minimum length of {#limit}",
    "string.max": "Full name should have a maximum length of {#limit}",
    "any.required": "Full name is required",
  }),
  email: Joi.string().lowercase().trim().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().trim().min(8).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "string.min": "Password should have a minimum length of {#limit}",
    "any.required": "Password is required",
  }),
  image: Joi.string().required().messages({
    "string.base": "Password must be a string",
    "any.required": "Image is required",
  }),
});

const loginUserSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().trim().min(8).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "string.min": "Password should have a minimum length of {#limit}",
    "any.required": "Password is required",
  }),
});
const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
});

const createUser = validateRequest(createUserSchema);
const userLogin = validateRequest(loginUserSchema);
const forgotPassword = validateRequest(forgotPasswordSchema);

export { createUser, userLogin, forgotPassword };
