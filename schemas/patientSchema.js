const Joi = require('joi');

const height = Joi.string();
const weight = Joi.string();
const rh = Joi.date();


const createPatientSchema = Joi.object({
  height: height,
  weight: weight,
  rh: rh.required()
});

module.exports = {
  createPatientSchema
}
