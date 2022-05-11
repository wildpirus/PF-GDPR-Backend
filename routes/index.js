const express = require('express');

const usersRouter = require('./usersRouter');
const patientsRouter = require('./patientRouter');

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
  router.use('/patients', patientsRouter);
}

module.exports = routerApi;
