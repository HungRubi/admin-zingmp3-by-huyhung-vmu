const MVs = require('../model/mv.model');
const Singers = require('../model/singers.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');
const { createSlug } = require('../../util/slug');
const { mongooseToObject } = require('../../util/mongoose');
const {formatDate} = require('../../util/formatDate.util')
class MVcontroller {
    /* [GET] /mv */
    async index(req, res, next) {
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let skip = (page - 1) * limit;
        let sortField = req.query.sort || 'name'; 
        let sortOrder = req.query.order === 'desc' ? -1 : 1; 
        try{
            const searchQuery = req.query.timkiem?.trim() || '';
            if (searchQuery) {
                const mvs = await MVs.find({
                    name: { $regex: searchQuery, $options: 'i' }
                }).sort({ [sortField]: sortOrder }).lean();
    
                const mvFormat = mvs.map(item => ({
                    ...item,
                    lastUpdate: formatDate(item.updatedAt)
                }));
    
                return res.render('mv/mv', {
                    searchType: true,
                    searchMv: mvFormat,
                    searchQuery,
                    currentSort: sortField,
                    currentOrder: sortOrder === 1 ? 'asc' : 'desc'
                });
            } 
    
            const mvs = await MVs.find()
                .skip(skip)
                .limit(limit)
                .sort({ [sortField]: sortOrder }) // Sắp xếp sản phẩm
                .lean();
    
            const formatMv = mvs.map(item => ({
                ...item,
                dateFormat: formatDate(item.updatedAt)
            }));
    
            const totalMv = await MVs.countDocuments();
            const totalPage = Math.ceil(totalMv / limit);
    
            res.render('mv/mv', {
                formatMv,
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
            const mv = new MVs({ name, img, video, singer, slug });
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
