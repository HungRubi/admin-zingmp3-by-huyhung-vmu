const express = require('express');
const route = express.Router();

const partnorController = require('../app/controller/partner.controller');
const partnorApi = require('../app/api/partnor.api');
/* Api */
route.get('/api/getpartnor', partnorApi.getApiPartnor);
/* Route */
route.get('/create', partnorController.pageCreate);
route.get('/:id/edit', partnorController.pageUpdate);
route.delete('/:id', partnorController.destroyTopic);
route.put('/:id', partnorController.update);
route.post('/store', partnorController.store);
route.get('/', partnorController.index);

module.exports = route;
