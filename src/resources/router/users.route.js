const express = require('express');
const route = express.Router();

const usersController = require('../app/controller/users.controller');

route.get('/:id/edit', usersController.editUser);
route.put('/:id', usersController.updateUser);
route.delete('/:id', usersController.deleteUser);
route.post('/store', usersController.store);
route.get('/create', usersController.createUser);
route.get('/', usersController.index);

module.exports = route;
