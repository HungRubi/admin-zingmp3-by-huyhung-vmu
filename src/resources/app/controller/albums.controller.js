const Albums = require('../model/albums.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');

class AlbumsController {
    index(req, res, next) {
        Albums.find({})
            .then((albums) => {
                res.render('albums', {
                    albums: mutipleMongooseoObjectT(albums),
                });
            })
            .catch(next);
    }
}

module.exports = new AlbumsController();
