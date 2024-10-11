const express = require('express');
const route = express.Router();

const singersController = require('../app/controller/singers.controller');
const SingerApi = require('../app/api/singers.api');

/* Api */
route.get('/api/randomsingers', SingerApi.getRandomSinger);
route.get('/api/getsinger/:slug', SingerApi.getSingerSlug);

/* Route */
route.get('/create', singersController.createSinger);
route.get('/:id/edit', singersController.editSinger);
route.put('/:id', singersController.update);
route.post('/store', singersController.store);
route.get('/', singersController.index);

module.exports = route;
