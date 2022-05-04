const Joi = require('joi');

const id_ = Joi.string();
const name_ = Joi.string();
const lastname_ = Joi.string();
const birthdate = Joi.date();
const documenttype = Joi.string().min(2).max(3);
const documentnumber = Joi.string();
const cellphone = Joi.string();
const address = Joi.string();
const postalcode = Joi.string();
const state = Joi.string();
const country = Joi.string();
const role = Joi.string();
const password = Joi.string();


const createUserSchema = Joi.object({
  name_: name_.required(),
  lastname_: lastname_.required(),
  birthdate: birthdate.required(),
  documenttype: documenttype.required(),
  documentnumber: documentnumber.required(),
  cellphone: cellphone.required(),
  address: address.required(),
  postalcode: postalcode.required(),
  state: state.required(),
  country: country.required(),
  password: password.required()
});

const loginUserSchema = Joi.object({
  documentnumber: documentnumber.required(),
  password: password.required()
});

const getUserSchema = Joi.object({
  id_: id_.required(),
});

module.exports = {
  createUserSchema,
  loginUserSchema,
  getUserSchema
}
