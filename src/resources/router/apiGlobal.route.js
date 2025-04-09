const express = require("express");
const route = express.Router();

const apiGlobalController = require('../app/api/apiGlobal');
const authenController = require('../app/api/authen.api');
const MiddlewareController = require('../app/controller/middleware.controller');

route.get('/search', apiGlobalController.querySearch);
route.delete('/singer/delete-favorite-singer/:id', apiGlobalController.deleteFavoriteSinger);
route.post('/singer/update-favorite-singer/:id', apiGlobalController.updateFavoriteSinger);
route.delete('/album/delete-favorite-album/:id', apiGlobalController.deleteFavoriteAlbums);
route.post('/album/update-favorite-album/:id', apiGlobalController.updateFavoriteAlbums);
route.delete('/songs/delete-playlist/:id', apiGlobalController.deleteFromPlayList);
route.post('/songs/update-playlist/:id', apiGlobalController.updatePlayList);
route.get('/songs/getall', apiGlobalController.getAllSongs);
route.get('/singer/:slug', apiGlobalController.getSingerDetail);
route.get('/mv/:slug', apiGlobalController.getMvDetail);
route.get('/bxh', apiGlobalController.getBXH);
route.get('/top100', apiGlobalController.getTop100);
route.get('/album/:slug', apiGlobalController.getAlbumDetail);
route.post('/authen/login', authenController.login);
route.post('/authen/logout',MiddlewareController.verifyToken,authenController.logout);
route.get('/authen/logout', (req, res) => {
    // Clear all authentication cookies
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    
    // Redirect to login page
    res.redirect('/api/authen/login');
});
route.post('/authen/refresh',MiddlewareController.verifyToken,authenController.requestRefreshToken);
route.get('/home', apiGlobalController.getHome);
route.get('/', (req, res) => {
    res.render('home', { user: res.locals.user });
});
route.get('/authen/login', (req, res) => {
    // Render the login page
    res.render('auth/login', { 
        error: null,
        layout: false
    });
});

module.exports = route;