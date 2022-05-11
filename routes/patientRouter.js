const express = require('express');

const PatientsService = require('../services/patientsService');
const validatorHandler = require('../middlewares/validatorHandler');
const {
  createPatientSchema,
  getPatientSchema
} = require('../schemas/patientSchema');


const router = express.Router();
const service = new PatientsService();

//Get patient
router.get('/',
  validatorHandler(getPatientSchema, 'query'),
  async (req,res, next) => {
    try {
      const { numberid } = req.query;
      const patient = await service.findOne(numberid);
      res.status(200).json(patient);
    } catch (error) {
      next(error);
    }
});

router.post('/register',
  validatorHandler(createPatientSchema, 'body'),
  async (req,res, next) => {
    try {
      const body = req.body;
      const newPatient = await service.create(body);
      res.status(201).json(newPatient);
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;
