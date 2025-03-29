const {createSlug} = require("../../util/slug");
const {formatDate} = require("../../util/formatDate.util");
const {mutipleMongooseoObjectT,mongooseToObject } = require("../../util/mongoose");
const Banner = require('../model/banner.model');
const Song = require('../model/songs.model');
class BannerController {

    /** [GET] /banner/getadd */
    async getAdd(req, res, next) {
        try{
            const songs = await Song.find();
            res.render("banner/bannerAdd", {
                songs: mutipleMongooseoObjectT(songs)
            })
        }catch(error) {
            next(error);
        }
    }

    /** [POST] /banner/add */
    async add(req, res) {
        try{   
            const {songs_id, thumbnail, name} = req.body;
            const slug = createSlug(name)
            const banner = new Banner({
                songs_id, 
                thumbnail, 
                name,
                slug
            })
            await banner.save();
            res.redirect("/banner")
        }catch(error){
            console.log(error)
            res.status(500).json({message: error})
        }
    }

    /** [GET] /banner */
    async index(req, res, next) {
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let skip = (page - 1) * limit;
        let sortField = req.query.sort || 'name'; 
        let sortOrder = req.query.order === 'desc' ? -1 : 1; 
        try{
            const searchQuery = req.query.timkiem?.trim() || '';
            if (searchQuery) {
                const banner = await Banner.find({
                    name: { $regex: searchQuery, $options: 'i' }
                }).sort({ [sortField]: sortOrder }).lean();
    
                const bannerFormat = banner.map(item => ({
                    ...item,
                    lastUpdate: formatDate(item.updatedAt)
                }));
    
                return res.render('banner/banner', {
                    searchType: true,
                    searchArticle: bannerFormat,
                    searchQuery,
                    currentSort: sortField,
                    currentOrder: sortOrder === 1 ? 'asc' : 'desc'
                });
            } 
    
            const banner = await Banner.find()
                .skip(skip)
                .limit(limit)
                .sort({ [sortField]: sortOrder }) // Sắp xếp sản phẩm
                .lean();
    
            const formatBanner = banner.map(item => ({
                ...item,
                dateFormat: formatDate(item.updatedAt)
            }));
    
            const totalBanner = await Banner.countDocuments();
            const totalPage = Math.ceil(totalBanner / limit);
    
            res.render('banner/banner', {
                formatBanner,
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

    /** [GET] /banner/:id/edit */
    async edit(req, res, next) {
        try{
            const songs = await Song.find();
            const banner = await Banner.findOne({_id: req.params.id});
            const song = await Song.findOne({_id: banner.songs_id});
            res.render("banner/bannerEdit", {
                songs: mutipleMongooseoObjectT(songs),
                banner: mongooseToObject(banner),
                song: mongooseToObject(song),
            })
        }catch(error){
            next(error);
        }
    }

    /** [PUT] /banner/:id */
    update(req, res, next) {
        Banner.updateOne({_id: req.params.id}, req.body)
        .then(() => {
            res.redirect("/banner");
        })
        .catch(error => {
            next(error);
        })
    }

    /** [DELETE] /banner/:id */
    delete(req, res, next) {
        Banner.deleteOne({_id: req.params.id})
        .then(() => res.redirect('/albums'))
        .catch(next);
    }
}

module.exports = new BannerController();