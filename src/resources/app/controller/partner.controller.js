const Partnor = require('../model/partnor.model');
const { mongooseToObject } = require('../../util/mongoose');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');
class PartnorController {
    /* [GET] /partnors */
    index(req, res, next) {
        Partnor.find({})
            .then((partnors) => {
                res.render('partnors/partnor', {
                    partnors: mutipleMongooseoObjectT(partnors),
                });
            })
            .catch(next);
    }

    /* [GET] /topic/create */
    pageCreate(req, res, next) {
        res.render('partnors/createPartnor');
    }

    /* [POST] /partnors/store */
    store = async (req, res, next) => {
        try {
            const { name, img } = req.body;
            const partnor = new Partnor({ name, img });
            await partnor.save();
            res.redirect('/partnors');
        } catch (error) {
            next(error);
        }
    };

    /* [GET] /topic/:id/edit */
    pageUpdate(req, res, next) {
        Partnor.findById(req.params.id)
            .then((partnor) => {
                res.render('partnor/updatePartnor', {
                    partnor: mongooseToObject(partnor),
                });
            })
            .catch(next);
    }

    /* [PUT] /topic/:id */
    update(req, res, next) {
        Partnor.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                res.redirect('/partnors');
            })
            .catch(next);
    }

    /* [DELETE] /topic/:id/delete */
    destroyTopic(req, res, next) {
        Partnor.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
}

module.exports = new PartnorController();
