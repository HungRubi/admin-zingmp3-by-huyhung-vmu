const Songs = require('../model/songs.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');

class SongsApi {
    /* GET /songs/api/allsongs */
    getAllSongs(req, res, next) {
        Songs.find({})
            .then((songs) => {
                res.json(songs);
            })
            .catch(next);
    }

    /* GET /songs/api/randumsongs */
    getRandumSongs(req, res, next) {
        Songs.aggregate([{ $sample: { size: 9 } }])
            .then((songs) => {
                res.json(songs);
            })
            .catch(next);
    }

    /* GET /songs/api/newsongsall */
    getNewSongsAll(req, res, next) {
        Songs.aggregate([{ $sample: { size: 9 } }])
            .then((songs) => {
                res.json(songs);
            })
            .catch(next);
    }

    /* GET  /songs/api/ */
    getNewSongsVn(req, res, next) {
        Songs.aggregate([
            { $match: { national: 'Việt Nam' } },
            { $sample: { size: 9 } },
        ])
            .then((songs) => {
                res.json(songs);
            })
            .catch(next);
    }

    /* GET  /songs/api/newsongsnational */
    getNewSongsNational(req, res, next) {
        Songs.aggregate([
            { $match: { national: 'Quốc Tế' } },
            { $sample: { size: 9 } },
        ])
            .then((songs) => {
                res.json(songs);
            })
            .catch(next);
    }

    /* GET  /songs/api/songsontungmtp */
    getSongSonTungMTP(req, res, next) {
        Songs.aggregate([
            { $match: { singer: 'Sơn Tùng MTP' } },
            { $sample: { size: 5 } },
        ])
            .then((songs) => {
                res.json(songs);
            })
            .catch(next);
    }

    /* GET /songs/api/songsbyalbum/:album */
    getSongsByAlbum(req, res, next) {
        var albumSlug = req.params.albumSlug;
        Songs.find({ albumSlug: albumSlug })
            .then((songs) => {
                res.json(songs);
            })
            .catch(next);
    }
}

module.exports = new SongsApi();
