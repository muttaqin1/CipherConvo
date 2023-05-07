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
