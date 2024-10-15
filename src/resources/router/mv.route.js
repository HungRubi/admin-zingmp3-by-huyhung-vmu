const express = require('express');
const route = express.Router();

const mvController = require('../app/controller/mv.controller');
const apiMv = require('../app/api/mv.api');

/* api */
route.get('/api/getmv/:slug', apiMv.getMvSlug);

/* route */
route.get('/:id/edit', mvController.editMv);
route.delete('/:id', mvController.destroyMV);
route.put('/:id', mvController.updateMV);
route.get('/create', mvController.createMv);
route.post('/store', mvController.store);
route.get('/', mvController.index);

module.exports = route;
