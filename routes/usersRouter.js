const express = require('express');
const passport = require('passport');

const UsersService = require('../services/usersService');
const validatorHandler = require('../middlewares/validatorHandler');
const {
  createUserSchema,
  loginUserSchema,
  recoverySchema,
  passwordRecoverySchema
} = require('../schemas/userSchema');

const router = express.Router();
const service = new UsersService();

// Create user
router.post('/signup',
  validatorHandler(createUserSchema, 'body'),
  async (req,res, next) => {
    try {
      const body = req.body;
      const newUser = await service.create(body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

// Login
router.post('/login',
  validatorHandler(loginUserSchema, 'body'),
  passport.authenticate('local', {session: false}),
  async (req, res, next) => {
    try {
      const user = req.user;
      res.json(service.signToken(user));
    } catch (error) {
      next(error);
    }
  }
);

// Recovery recoverySchema
router.post('/recovery',
validatorHandler(recoverySchema, 'body'),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const rta = await service.sendRecoveryMail(email);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

// Recover password passwordRecoverySchema
router.post('/recover-password',
  validatorHandler(passwordRecoverySchema, 'body'),
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const rta = await service.recoverPassword(token, newPassword);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

// Get my user
router.get('/',
  passport.authenticate('jwt', {session: false}),
  async (req,res, next) => {
    try {
      const id = req.user.sub;
      const user = await service.findById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
});


module.exports = router;
