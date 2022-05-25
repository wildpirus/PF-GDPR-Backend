const express = require('express');
const passport = require('passport');

const PersonsService = require('../services/personsService');
const validatorHandler = require('../middlewares/validatorHandler');
const { checkRoles } = require('../middlewares/authHandler');
const {
  createPersonSchema
} = require('../schemas/personSchema');

const router = express.Router();
const service = new PersonsService();

// get my person data
router.get('/',
  passport.authenticate('jwt', {session: false}),
  async (req,res, next) => {
    try {
      const { user_id } = req.user;
      const person = await service.findPersonByUserId(user_id);
      res.status(201).json(person);
    } catch (error) {
      next(error);
    }
  }
);

// get patient data
router.get('/:person_id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('MED'),
  async (req,res, next) => {
    try {
      const { person_id } = req.params;
      const person = await service.findPersonById(person_id);
      res.status(201).json(person);
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;
