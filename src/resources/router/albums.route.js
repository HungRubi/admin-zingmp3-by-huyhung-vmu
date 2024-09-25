const express = require('express');
const route = express.Router();

const albumsController = require('../app/controller/albums.controller');
const albumsApi = require('../app/api/albums.api');

/* Api */
route.get('/api/allalbums', albumsApi.getAllAlbums);
route.get('/api/albumsmaylike', albumsApi.getAlbumsMayLike);
route.get('/api/albumsstorm', albumsApi.getAlbumsStorm);
route.get('/api/albumslistendance', albumsApi.getAlbumsListenDance);
route.get('/api/albumschill', albumsApi.getAlbumsChill);
route.get('/api/albumstop100', albumsApi.getAlbumsTop100);
route.get('/api/albumshot', albumsApi.getAlbumsHot);
route.get('/api/albumsradio', albumsApi.getAlbumsRadio);
route.get('/api/detailalbum/:slug', albumsApi.getDetailAlbum);

/* Interface Admin */
route.get('/:id/edit', albumsController.editAlbums);
route.delete('/:id', albumsController.destroyAlbums);
route.put('/:id', albumsController.updateAlbums);
route.get('/create', albumsController.createAlbums);
route.post('/store', albumsController.store);
route.get('/', albumsController.index);

module.exports = route;
