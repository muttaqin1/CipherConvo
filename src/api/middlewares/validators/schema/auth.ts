import Joi from 'joi';
import JoiPasswordComplexity from 'joi-password-complexity';

const complexityOptions = {
  min: 8,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4
};
export const signupSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  gender: Joi.string().required(),
  password: JoiPasswordComplexity(complexityOptions).required(),
  confirmPassword: Joi.ref('password')
});

export const loginSchema = Joi.object({
  email: Joi.string().email(),
  userName: Joi.string(),
  password: JoiPasswordComplexity(complexityOptions).required()
}).xor('email', 'userName');

export const tokenRefreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});
export const emailSchema = Joi.object({
  email: Joi.string().email().required()
});
export const tokenSchema = Joi.object({
  token: Joi.string().required()
});
export const usernameSchema = Joi.object({
  userName: Joi.string().required()
});
export const updateSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  gender: Joi.string()
}).or('firstName', 'lastName', 'gender');