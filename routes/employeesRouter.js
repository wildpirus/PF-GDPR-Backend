const express = require('express');
const passport = require('passport');

const EmployeesService = require('../services/employeesService');
const validatorHandler = require('../middlewares/validatorHandler');
const { checkRoles } = require('../middlewares/authHandler');
const {
  createUserSchema,
} = require('../schemas/userSchema');
const {
  createPersonSchema
} = require('../schemas/personSchema');
const {
  createEmployeeSchema,
  createEmployeeWithPersonSchema
} = require('../schemas/employeeSchema');


const router = express.Router();
const service = new EmployeesService();

router.post('/register-all-new',
  passport.authenticate('jwt', {session: false}),
  checkRoles('MED'),
  validatorHandler(createUserSchema, 'body.user'),
  validatorHandler(createPersonSchema, 'body.person'),
  validatorHandler(createEmployeeSchema, 'body.employee'),
  async (req,res, next) => {
    try {
      const body = req.body;
      const newEmployee = await service.createAllNewEmployee(body);
      res.status(201).json(newEmployee);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/register-new',
  passport.authenticate('jwt', {session: false}),
  checkRoles('MED'),
  validatorHandler(createEmployeeWithPersonSchema, 'body'),
  async (req,res, next) => {
    try {
      const body = req.body;
      const newEmployee = await service.create(body,body.person_id);
      res.status(201).json(newEmployee);
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;
