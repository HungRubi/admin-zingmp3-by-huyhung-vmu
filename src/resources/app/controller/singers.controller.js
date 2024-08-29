const Singers = require('../model/singers.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const { createSlug } = require('../../util/slug');
const { response } = require('express');
class SingerController {
    /* [GET] /singers */
    index(req, res, next) {
        Singers.find({})
            .then((singers) => {
                console.log(singers);
                res.render('singers/singers', {
                    singers: mutipleMongooseoObjectT(singers),
                });
            })
            .catch(next);
    }
    /* [GET] /singers/create */
    createSinger(req, res, next) {
        res.render('singers/createSingers');
    }

    /* [POST] /singers/store */
    store = async (req, res, next) => {
        try {
            const { name, description, img, imginfor, birth, stagename } =
                req.body;
            let slug = createSlug(stagename);
            const singer = new Singers({
                name,
                description,
                img,
                imginfor,
                birth,
                stagename,
                slug,
            });
            await singer.save();
            res.redirect('/singers');
        } catch (error) {
            next(error);
        }
    };

    /* [GET] singers/:id/edit */
    editSinger(req, res, next) {
        Singers.findById(req.params.id)
            .then((singer) => {
                res.render('singers/updateSinger', {
                    singer: mongooseToObject(singer),
                });
            })
            .catch(next);
    }

    update(req, res, next) {
        Singers.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                res.redirect('/singers');
            })
            .catch(next);
    }
}

module.exports = new SingerController();
