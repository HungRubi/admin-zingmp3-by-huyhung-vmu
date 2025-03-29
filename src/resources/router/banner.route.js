const express = require("express");
const route = express.Router();

const bannerController = require('../app/controller/banner.controller');

route.post('/add', bannerController.add);
route.get('/:id/edit', bannerController.edit);
route.put('/:id', bannerController.update);
route.delete('/:id', bannerController.delete);
route.get('/add', bannerController.getAdd);
route.get('/', bannerController.index);

module.exports = route;