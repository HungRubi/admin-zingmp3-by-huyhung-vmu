const Singers = require('../model/singers.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const { createSlug } = require('../../util/slug');
const {formatDate} = require('../../util/formatDate.util')
class SingerController {
    /* [GET] /singers */
    async index(req, res, next) {
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let skip = (page - 1) * limit;
        let sortField = req.query.sort || 'stagename'; 
        let sortOrder = req.query.order === 'desc' ? -1 : 1; 
        try{
            const searchQuery = req.query.timkiem?.trim() || '';
            if (searchQuery) {
                const singer = await Singers.find({
                    stagename: { $regex: searchQuery, $options: 'i' }
                }).sort({ [sortField]: sortOrder }).lean();
    
                const singerFormat = singer.map(item => ({
                    ...item,
                    lastUpdate: formatDate(item.updatedAt)
                }));
    
                return res.render('singers/singers', {
                    searchType: true,
                    searchSinger: singerFormat,
                    searchQuery,
                    currentSort: sortField,
                    currentOrder: sortOrder === 1 ? 'asc' : 'desc'
                });
            } 
    
            const singer = await Singers.find()
                .skip(skip)
                .limit(limit)
                .sort({ [sortField]: sortOrder }) // Sắp xếp sản phẩm
                .lean();
    
            const singerFormat = singer.map(item => ({
                ...item,
                dateFormat: formatDate(item.updatedAt)
            }));
    
            const totalUser = await Singers.countDocuments();
            const totalPage = Math.ceil(totalUser / limit);
    
            res.render('singers/singers', {
                singerFormat,
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
