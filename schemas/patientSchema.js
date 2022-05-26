const Joi = require('joi');

const height = Joi.string();
const weight = Joi.string();
const rh = Joi.string();
const person_id = Joi.string();
const consent = Joi.boolean();


const createPatientSchema = Joi.object({
  height: height,
  weight: weight,
  rh: rh.required(),
  full_consent: consent.required(),
  part_consent: consent.required()
});

const createPatientWithPersonSchema = Joi.object({
  height: height,
  weight: weight,
  rh: rh.required(),
  full_consent: consent.required(),
  part_consent: consent.required(),
  person_id: person_id.required()
});

const updateConsentsSchema = Joi.object({
  full_consent: consent.required(),
  part_consent: consent.required()
});

module.exports = {
  createPatientSchema,
  createPatientWithPersonSchema,
  updateConsentsSchema
}
