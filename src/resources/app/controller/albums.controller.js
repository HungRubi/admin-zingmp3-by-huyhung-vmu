const Albums = require('../model/albums.model');
const Topic = require('../model/topic.model');
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
        Topic.find({})
            .then((topic) => {
                res.render('albums/createAlbums', {
                    topic: mutipleMongooseoObjectT(topic),
                });
            })
            .catch(next);
    }

    /* [POST] /albums/store */
    store = async (req, res, next) => {
        try {
            const { name, topic, img, description } = req.body;
            var slug = createSlug(name);
            const album = new Albums({ name, img, topic, description, slug });
            await album.save();
            res.redirect('/albums');
        } catch (error) {
            next(error);
        }
    };

    /* [GET] /albums/:id/edit */
    editAlbums(req, res, next) {
        Promise.all([Albums.findById(req.params.id), Topic.find({})])
            .then(([album, topic]) => {
                res.render('albums/updateAlbums', {
                    album: mongooseToObject(album),
                    topic: mutipleMongooseoObjectT(topic),
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
