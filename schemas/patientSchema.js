const Joi = require('joi');

const height = Joi.string();
const weight = Joi.string();
const rh = Joi.string();
const person_id = Joi.string();


const createPatientSchema = Joi.object({
  height: height,
  weight: weight,
  rh: rh.required()
});

const createPatientWithPersonSchema = Joi.object({
  height: height,
  weight: weight,
  rh: rh.required(),
  person_id: person_id.required()
});

module.exports = {
  createPatientSchema,
  createPatientWithPersonSchema
}
