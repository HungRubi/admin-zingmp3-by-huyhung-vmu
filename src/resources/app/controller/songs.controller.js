const Songs = require('../model/songs.model');
const Singers = require('../model/singers.model');
const { createSlug } = require('../../util/slug');
const Albums = require('../model/albums.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
class SongsController {
    /* GET /songs */
    index(req, res, next) {
        Songs.find({})
            .then((songs) => {
                res.render('songs/songs', {
                    songs: mutipleMongooseoObjectT(songs),
                });
            })
            .catch(next);
    }

    /* GET /songs/create-song */
    createSong(req, res, next) {
        Promise.all([Singers.find({}), Albums.find({})])
            .then(([singers, albums]) => {
                res.render('songs/createSongs', {
                    singers: mutipleMongooseoObjectT(singers),
                    albums: mutipleMongooseoObjectT(albums),
                });
            })
            .catch(next);
    }
    /* [] */

    /* [POST] /songs/store */
    store = async (req, res, next) => {
        try {
            const { name, img, national, music, singer, album } = req.body;
            let slug = createSlug(name);
            const song = new Songs({
                name,
                img,
                national,
                singer,
                music,
                album,
                slug,
            });
            await song.save();
            res.redirect('/songs');
        } catch (error) {
            next(error);
        }
    };

    /* [GET] /songs/:id/edit */
    pageUpdate(req, res, next) {
        Promise.all([
            Singers.find({}),
            Albums.find({}),
            Songs.findById(req.params.id),
        ])
            .then(([singers, albums, song]) => {
                res.render('songs/updateSongs', {
                    song: mongooseToObject(song),
                    singers: mutipleMongooseoObjectT(singers),
                    albums: mutipleMongooseoObjectT(albums),
                });
            })
            .catch(next);
    }

    /* [PUT] /songs/:id */
    updateSong(req, res, next) {
        Songs.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/songs'))
            .catch(next);
    }

    /* [DELETE] /songs/:id */
    destroySong(req, res, next) {
        Songs.deleteOne({ _id: req.params.id })
            .then(() => {
                res.redirect('back');
            })
            .catch(next);
    }
}

module.exports = new SongsController();
