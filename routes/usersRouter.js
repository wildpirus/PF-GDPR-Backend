const express = require('express');
const passport = require('passport');

const UsersService = require('../services/usersService');
const validatorHandler = require('../middlewares/validatorHandler');
const { checkRoles } = require('../middlewares/authHandler');
const {
  loginUserSchema,
  recoverySchema,
  passwordRecoverySchema
} = require('../schemas/userSchema');

const router = express.Router();
const service = new UsersService();

// Login
router.post('/login',
  validatorHandler(loginUserSchema, 'body'),
  passport.authenticate('local', {session: false}),
  async (req, res, next) => {
    try {
      const user = req.user;
      const { role } = req.body;
      res.json(await service.signToken(user, role));
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
      const {user_id, role_name } = req.user;
      const role = role_name === 'patient' ? role_name : 'employee'
      const user = await service.getUserInfo(user_id, role);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
});


module.exports = router;
