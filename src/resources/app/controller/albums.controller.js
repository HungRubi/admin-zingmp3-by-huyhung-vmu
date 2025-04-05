const Albums = require('../model/albums.model');
const Topic = require('../model/topic.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');
const { createSlug } = require('../../util/slug');
const { mongooseToObject } = require('../../util/mongoose');
const {formatDate} = require('../../util/formatDate.util');
class AlbumsController {
    /* [GET] /albums */
    async index(req, res, next) {
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let skip = (page - 1) * limit;
        let sortField = req.query.sort || 'name'; 
        let sortOrder = req.query.order === 'desc' ? -1 : 1; 
        try{
            const searchQuery = req.query.timkiem?.trim() || '';
            if (searchQuery) {
                const albums = await Albums.find({
                    name: { $regex: searchQuery, $options: 'i' }
                }).sort({ [sortField]: sortOrder }).lean();
    
                const albumFormat = albums.map(item => ({
                    ...item,
                    lastUpdate: formatDate(item.updatedAt)
                }));
    
                return res.render('albums/albums', {
                    searchType: true,
                    searchArticle: albumFormat,
                    searchQuery,
                    currentSort: sortField,
                    currentOrder: sortOrder === 1 ? 'asc' : 'desc'
                });
            } 
    
            const albums = await Albums.find()
                .skip(skip)
                .limit(limit)
                .sort({ [sortField]: sortOrder }) // Sắp xếp sản phẩm
                .lean();
    
            const formatAlbum = albums.map(item => ({
                ...item,
                dateFormat: formatDate(item.updatedAt)
            }));
    
            const totalAlbum = await Albums.countDocuments();
            const totalPage = Math.ceil(totalAlbum / limit);
    
            res.render('albums/albums', {
                formatAlbum,
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
    async updateAlbums(req, res, next) {
        try {
            if (req.body.name) {
                req.body.slug = createSlug(req.body.name);
            }
            
            await Albums.updateOne({ _id: req.params.id }, req.body);
            res.redirect('/albums');
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    

    /* [DELETE] /albums/:id/delete */
    destroyAlbums(req, res, next) {
        Albums.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
}

module.exports = new AlbumsController();
