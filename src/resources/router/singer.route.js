const express = require('express');
const route = express.Router();

const singersController = require('../app/controller/singers.controller');

route.get('/', singersController.index);

module.exports = route;
