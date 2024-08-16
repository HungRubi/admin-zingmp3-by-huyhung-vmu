const express = require('express');
const route = express.Router();

const topicController = require('../app/controller/topic.controller');

route.get('/create', topicController.pageCreate);
route.get('/:id/edit', topicController.pageUpdate);
route.delete('/:id', topicController.destroyTopic);
route.put('/:id', topicController.update);
route.post('/store', topicController.store);
route.get('/', topicController.index);

module.exports = route;
