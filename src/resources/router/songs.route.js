const songsController = require('../app/controller/songs.controller');
const express = require('express');
const route = express.Router();

route.get('/:id/edit', songsController.pageUpdate);
route.put('/:id', songsController.updateSong);
route.delete('/:id', songsController.destroySong);
route.get('/create-song', songsController.createSong);
route.post('/store', songsController.store);
route.get('/', songsController.index);

module.exports = route;
