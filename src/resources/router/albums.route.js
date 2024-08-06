const express = require('express');
const route = express.Router();

const albumsController = require('../app/controller/albums.controller');

route.get('/', albumsController.index);

module.exports = route;
