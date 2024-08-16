const express = require('express');
const route = express.Router();

const singersController = require('../app/controller/singers.controller');

route.get('/create', singersController.createSinger);
route.get('/:id/edit', singersController.editSinger);
route.put('/:id', singersController.update);
route.post('/store', singersController.store);
route.get('/', singersController.index);

module.exports = route;
