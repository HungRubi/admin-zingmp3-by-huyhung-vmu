const Topic = require('../model/topic.model');
const { mongooseToObject } = require('../../util/mongoose');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');
const { createSlug } = require('../../util/slug');
class ToPicController {
    /* [GET] /topic */
    index(req, res, next) {
        Topic.find({})
            .then((topic) => {
                res.render('topic/topic', {
                    topic: mutipleMongooseoObjectT(topic),
                });
            })
            .catch(next);
    }

    /* [GET] /topic/create */
    pageCreate(req, res, next) {
        res.render('topic/createTopic');
    }

    /* [POST] /topic/store */
    store = async (req, res, next) => {
        try {
            const { name, title } = req.body;
            let slug = createSlug(name);
            const topic = new Topic({ name, title, slug });
            await topic.save();
            res.redirect('/topic');
        } catch (error) {
            next(error);
        }
    };

    /* [GET] /topic/:id/edit */
    pageUpdate(req, res, next) {
        Topic.findById(req.params.id)
            .then((topic) => {
                res.render('topic/updateTopic', {
                    topic: mongooseToObject(topic),
                });
            })
            .catch(next);
    }

    /* [PUT] /topic/:id */
    update(req, res, next) {
        Topic.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                res.redirect('/topic');
            })
            .catch(next);
    }

    /* [DELETE] /topic/:id/delete */
    destroyTopic(req, res, next) {
        Topic.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
}

module.exports = new ToPicController();
