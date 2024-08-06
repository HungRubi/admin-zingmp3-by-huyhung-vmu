const express = require('express');
const route = express.Router();

const usersController = require('../app/controller/users.controller');

route.get('/', usersController.index);

module.exports = route;
