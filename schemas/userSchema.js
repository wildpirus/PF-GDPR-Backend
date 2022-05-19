const Joi = require('joi');

const usersid = Joi.string();
const username = Joi.string();
const password = Joi.string().min(8);
const jwt = Joi.string();
const email = Joi.string().email();


const createUserSchema = Joi.object({
  username: username.required(),
  password: password.required()
});

const loginUserSchema = Joi.object({
  username: username.required(),
  password: password.required()
});

const passwordRecoverySchema = Joi.object({
  token: jwt.required(),
  newPassword: password.required()
});

const recoverySchema = Joi.object({
  email: email.required(),
});

module.exports = {
  createUserSchema,
  loginUserSchema,
  recoverySchema,
  passwordRecoverySchema
}
