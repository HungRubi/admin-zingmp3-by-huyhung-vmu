const MVs = require('../model/mv.model');
const Singers = require('../model/singers.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');
const { createSlug } = require('../../util/slug');
const { mongooseToObject } = require('../../util/mongoose');
class MVcontroller {
    /* [GET] /mv */
    index(req, res, next) {
        MVs.find({})
            .then((mv) => {
                res.render('mv/mv', {
                    mv: mutipleMongooseoObjectT(mv),
                });
            })
            .catch(next);
    }

    /* [GET] /mv/ceate */
    createMv(req, res, next) {
        Singers.find({})
            .then((singer) => {
                res.render('mv/createMv', {
                    singer: mutipleMongooseoObjectT(singer),
                });
            })
            .catch(next);
    }

    /* [POST] /mv/store */
    store = async (req, res, next) => {
        try {
            const { name, singer, img } = req.body;
            var slug = createSlug(name);
            const mv = new MVs({ name, img, singer, slug });
            await mv.save();
            res.redirect('/mv');
        } catch (error) {
            next(error);
        }
    };

    /* [GET] /mv/:id/edit */
    editMv(req, res, next) {
        Promise.all([MVs.findById(req.params.id), Singers.find({})])
            .then(([mv, singer]) => {
                res.render('mv/updateMv', {
                    mv: mongooseToObject(mv),
                    singer: mutipleMongooseoObjectT(singer),
                });
            })
            .catch(next);
    }

    /* [PUT] /mv/:id */
    updateMV(req, res, next) {
        MVs.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/mv'))
            .catch(next);
    }

    /* [DELETE] /mv/:id/delete */
    destroyMV(req, res, next) {
        MVs.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
}

module.exports = new MVcontroller();
