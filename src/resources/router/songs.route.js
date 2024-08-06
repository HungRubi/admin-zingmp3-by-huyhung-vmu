const songsController = require('../app/controller/songs.controller');
const express = require('express');
const route = express.Router();

route.get('/', songsController.index);

module.exports = route;
