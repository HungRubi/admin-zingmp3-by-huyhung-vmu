const Albums = require('../model/albums.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');
const { createSlug } = require('../../util/slug');
const { mongooseToObject } = require('../../util/mongoose');
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
        res.render('albums/createAlbums');
    }

    /* [POST] /albums/store */
    store = async (req, res, next) => {
        try {
            const { name, img, description } = req.body;
            var slug = createSlug(name);
            const album = new Albums({ name, img, description, slug });
            await album.save();
            res.redirect('/albums');
        } catch (error) {
            next(error);
        }
    };

    /* [GET] /albums/:id/edit */
    editAlbums(req, res, next) {
        Albums.findById(req.params.id)
            .then((album) => {
                res.render('albums/updateAlbums', {
                    album: mongooseToObject(album),
                });
            })
            .catch(next);
    }

    /* [PUT] /albums/:id */
    updateAlbums(req, res, next) {
        Albums.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/albums'))
            .catch(next);
    }

    /* [DELETE] /albums/:id/delete */
    destroyAlbums(req, res, next) {
        Albums.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
}

module.exports = new AlbumsController();
