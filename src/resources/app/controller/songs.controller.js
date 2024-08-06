const Songs = require('../model/songs.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');

class SongsController {
    index(req, res, next) {
        Songs.find({})
            .then((songs) => {
                res.render('songs/songs', {
                    songs: mutipleMongooseoObjectT(songs),
                });
            })
            .catch(next);
    }
}

module.exports = new SongsController();
