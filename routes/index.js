const express = require('express');

const usersRouter = require('./usersRouter');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/', express.Router().get('/',
    async (req,res, next) => {
      try {
        res.status(200).send("Welcome to the backend API for CADITO!");
      } catch (error) {
        next(error);
      }
    }
  ));
  router.use('/users', usersRouter);
}

module.exports = routerApi;
