const express = require("express");
const route = express.Router();

const apiGlobalController = require('../app/api/apiGlobal');
const authenController = require('../app/api/authen.api');
const MiddlewareController = require('../app/controller/middleware.controller');

route.get('/singer/:slug', apiGlobalController.getSingerDetail);
route.get('/mv/:slug', apiGlobalController.getMvDetail);
route.get('/bxh', apiGlobalController.getBXH);
route.get('/top100', apiGlobalController.getTop100);
route.get('/album/:slug', apiGlobalController.getAlbumDetail);
route.post('/authen/login', authenController.login);
route.post('/authen/logout',MiddlewareController.verifyToken,authenController.logout);
route.post('/authen/refresh',MiddlewareController.verifyToken,authenController.requestRefreshToken);
route.get('/home', apiGlobalController.getHome);

module.exports = route;