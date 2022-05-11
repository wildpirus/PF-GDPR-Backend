const Joi = require('joi');

const userid = Joi.string();
const username = Joi.string();
const password = Joi.string();


const createUserSchema = Joi.object({
  username: username.required(),
  password: password.required()
});

const loginUserSchema = Joi.object({
  username: username.required(),
  password: password.required()
});

const getUserSchema = Joi.object({
  userid: userid.required(),
});

module.exports = {
  createUserSchema,
  loginUserSchema,
  getUserSchema
}
