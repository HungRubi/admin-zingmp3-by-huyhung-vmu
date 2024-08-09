const express = require('express');
const route = express.Router();

const albumsController = require('../app/controller/albums.controller');

route.get('/:id/edit', albumsController.editAlbums);
route.delete('/:id', albumsController.destroyAlbums);
route.put('/:id', albumsController.updateAlbums);
route.get('/create', albumsController.createAlbums);
route.post('/store', albumsController.store);
route.get('/', albumsController.index);

module.exports = route;
