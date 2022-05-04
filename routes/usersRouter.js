const express = require('express');

const UsersService = require('../services/usersService');
const validatorHandler = require('../middlewares/validatorHandler');
const {
  createUserSchema,
  loginUserSchema,
  getUserSchema
} = require('../schemas/userSchema');


const router = express.Router();
const service = new UsersService();

//Get user
router.get('/',
  validatorHandler(getUserSchema, 'query'),
  async (req,res, next) => {
    try {
      const { id_ } = req.query;
      const user = await service.findOne(id_);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
});

router.post('/register',
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

router.post('/login',
  validatorHandler(loginUserSchema, 'body'),
  async (req,res) => {
    const body = req.body;
    const user = await service.login(body);
    res.status(200).json(user);
  }
);

router.post('/prev-login',
  validatorHandler(getUserSchema, 'body'),
  async (req,res) => {
    const { user_id } = req.body;
    const user = await service.prevLogin(user_id);
    res.status(200).json(user);
  }
);

module.exports = router;


/*
const express = require('express');
const faker = require('faker');

const router = express.Router();

router.get('/',(req, res) => {
  const {limit, offset} = req.query;
  if (limit && offset) {
    res.json({
      limit,
      offset
    });
  }else {
    res.send("No hay parametros")
  }
});

module.exports = router;
*/
