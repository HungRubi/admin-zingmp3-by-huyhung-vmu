const songsApi = require('../app/api/songs.api');
const songsController = require('../app/controller/songs.controller');
const express = require('express');
const route = express.Router();

/* Api */
route.get('/api/allsongs', songsApi.getAllSongs);
route.get('/api/randumsongs', songsApi.getRandumSongs);
route.get('/api/newsongsall', songsApi.getNewSongsAll);
route.get('/api/newsongsvn', songsApi.getNewSongsVn);
route.get('/api/newsongsnational', songsApi.getNewSongsNational);
route.get('/api/songsontungmtp', songsApi.getSongSonTungMTP);
route.get('/api/songsbyalbum/:albumSlug', songsApi.getSongsByAlbum);
/* Route */
route.put('/all', songsController.updateSongs);
route.put('/:id', songsController.updateSong);
route.delete('/:id', songsController.destroySong);
route.post('/store', songsController.store);
route.get('/:id/edit', songsController.pageUpdate);
route.get('/create-song', songsController.createSong);
route.get('/', songsController.index);

module.exports = route;
