const express = require('express');
const route = express.Router();

const userApi = require('../app/api/user.api');
const usersController = require('../app/controller/users.controller');

/* Api */
route.get('/api/:id', userApi.getInfor);

route.get('/:id/edit', usersController.editUser);
route.put('/:id', usersController.updateUser);
route.delete('/:id', usersController.deleteUser);
route.post('/store', usersController.store);
route.get('/create', usersController.createUser);
route.get('/:id', usersController.userDetail);
route.get('/', usersController.index);

module.exports = route;
