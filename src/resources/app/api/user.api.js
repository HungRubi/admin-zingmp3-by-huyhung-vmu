const User = require('../model/user.model');
const Song = require('../model/songs.model');
const Album = require('../model/albums.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
class ApiUser {
    /** [GET] /user/api/:id */
    getInfor(req, res, next) {
        User.findById(req.params.id)
            .then((user) => {
                Song.find({ _id: { $in: user.favoriteSongs } })
                    .then((songs) => {
                        Album.find({ _id: { $in: user.favoriteAlbums } })
                            .then((albums) => {
                                res.json({
                                    user,
                                    songs,
                                    albums,
                                });
                            })
                            .catch(next);
                    })
                    .catch(next);
            })
            .catch(next);
    }
}

module.exports = new ApiUser();
