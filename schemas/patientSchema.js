const Joi = require('joi');

const patientid = Joi.string();
const firstname = Joi.string();
const lastname = Joi.string();
const typeid = Joi.string().min(2).max(3);
const numberid = Joi.string();
const expeditiondateid = Joi.date();
const birthdate = Joi.date();
const expeditionplaceid = Joi.string();
const civilstate = Joi.string();
const email = Joi.string();
const userid = Joi.string();


const createPatientSchema = Joi.object({
  firstname: firstname.required(),
  lastname: lastname.required(),
  typeid: typeid.required(),
  numberid: numberid.required(),
  expeditiondateid: expeditiondateid,
  birthdate: birthdate,
  expeditionplaceid: expeditionplaceid,
  civilstate: civilstate,
  email: email.required(),
  userid: userid.required()
});

const getPatientSchema = Joi.object({
  numberid: numberid.required(),
});

module.exports = {
  createPatientSchema,
  getPatientSchema
}
