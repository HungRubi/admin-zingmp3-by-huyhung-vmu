const Albums = require('../model/albums.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');

class AlbumsController {
    /* [GET] /albums */
    index(req, res, next) {
        Albums.find({})
            .then((albums) => {
                res.render('albums/albums', {
                    albums: mutipleMongooseoObjectT(albums),
                });
            })
            .catch(next);
    }

    /* [GET] /albums/ceate */
    createAlbums(req, res, next) {
        res.rende;
    }
}

module.exports = new AlbumsController();
