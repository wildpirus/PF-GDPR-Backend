const express = require('express');
const passport = require('passport');

const PatientsService = require('../services/patientsService');
const validatorHandler = require('../middlewares/validatorHandler');
const { checkRoles } = require('../middlewares/authHandler');
const {
  createUserSchema,
} = require('../schemas/userSchema');
const {
  createPersonSchema
} = require('../schemas/personSchema');
const {
  createPatientSchema,
  createPatientWithPersonSchema
} = require('../schemas/patientSchema');


const router = express.Router();
const service = new PatientsService();

router.post('/register-all-new',
  passport.authenticate('jwt', {session: false}),
  checkRoles('MED'),
  validatorHandler(createUserSchema, 'body.user'),
  validatorHandler(createPersonSchema, 'body.person'),
  validatorHandler(createPatientSchema, 'body.patient'),
  async (req,res, next) => {
    try {
      const body = req.body;
      const newPatient = await service.createAllNewPatient(body);
      res.status(201).json(newPatient);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/register-new',
  passport.authenticate('jwt', {session: false}),
  checkRoles('MED'),
  validatorHandler(createPatientWithPersonSchema, 'body'),
  async (req,res, next) => {
    try {
      const body = req.body;
      const newPatient = await service.create(body,body.person_id);
      res.status(201).json(newPatient);
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;