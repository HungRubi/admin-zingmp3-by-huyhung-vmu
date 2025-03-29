const Topic = require('../model/topic.model');
const { mongooseToObject } = require('../../util/mongoose');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');
const { createSlug } = require('../../util/slug');
const {formatDate} = require('../../util/formatDate.util');
class ToPicController {
    /* [GET] /topic */
    async index(req, res, next) {
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let skip = (page - 1) * limit;
        let sortField = req.query.sort || 'name'; 
        let sortOrder = req.query.order === 'desc' ? -1 : 1; 
        try{
            const searchQuery = req.query.timkiem?.trim() || '';
            if (searchQuery) {
                const topic = await Topic.find({
                    name: { $regex: searchQuery, $options: 'i' }
                }).sort({ [sortField]: sortOrder }).lean();
    
                const topicFormat = topic.map(item => ({
                    ...item,
                    lastUpdate: formatDate(item.updatedAt)
                }));
    
                return res.render('topic/topic', {
                    searchType: true,
                    searchTopic: topicFormat,
                    searchQuery,
                    currentSort: sortField,
                    currentOrder: sortOrder === 1 ? 'asc' : 'desc'
                });
            } 
    
            const topic = await Topic.find()
                .skip(skip)
                .limit(limit)
                .sort({ [sortField]: sortOrder }) // Sắp xếp sản phẩm
                .lean();
    
            const formatTopic = topic.map(item => ({
                ...item,
                dateFormat: formatDate(item.updatedAt)
            }));
    
            const totalTopic = await Topic.countDocuments();
            const totalPage = Math.ceil(totalTopic / limit);
    
            res.render('topic/topic', {
                formatTopic,
                currentPage: page,
                totalPage,
                searchType: false,
                currentSort: sortField,
                currentOrder: sortOrder === 1 ? 'asc' : 'desc'
            });
        }catch(err){
            next(err);
        }
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
