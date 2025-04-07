const express = require('express');
const route = express.Router();
const authController = require('../app/controller/auth.controller');

// Login page
route.get('/login', authController.loginPage);

// Login action
route.post('/login', authController.login);

// Logout
route.get('/logout', authController.logout);

module.exports = route; 