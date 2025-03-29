const express = require("express");
const route = express.Router();

const apiGlobalController = require('../app/api/apiGlobal');

route.get('/home', apiGlobalController.getHome);

module.exports = route;