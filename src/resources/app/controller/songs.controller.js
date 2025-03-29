const Songs = require('../model/songs.model');
const Singers = require('../model/singers.model');
const { createSlug } = require('../../util/slug');
const Albums = require('../model/albums.model');
const { mutipleMongooseoObjectT, mongooseToObject } = require('../../util/mongoose');
const {formatDate} = require('../../util/formatDate.util');
class SongsController {
    /* GET /songs */
    async index(req, res, next) {
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let skip = (page - 1) * limit;
        let sortField = req.query.sort || 'name'; 
        let sortOrder = req.query.order === 'desc' ? -1 : 1; 
        try{
            const searchQuery = req.query.timkiem?.trim() || '';
            if (searchQuery) {
                const songs = await Songs.find({
                    name: { $regex: searchQuery, $options: 'i' }
                }).sort({ [sortField]: sortOrder }).lean();
    
                const songFormat = songs.map(item => ({
                    ...item,
                    lastUpdate: formatDate(item.updatedAt)
                }));
    
                return res.render('songs/songs', {
                    searchType: true,
                    searchArticle: songFormat,
                    searchQuery,
                    currentSort: sortField,
                    currentOrder: sortOrder === 1 ? 'asc' : 'desc'
                });
            } 
    
            const songs = await Songs.find()
                .skip(skip)
                .limit(limit)
                .sort({ [sortField]: sortOrder }) // Sắp xếp sản phẩm
                .lean();
    
            const formatSongs = songs.map(item => ({
                ...item,
                dateFormat: formatDate(item.updatedAt)
            }));
    
            const totalSongs = await Songs.countDocuments();
            const totalPage = Math.ceil(totalSongs / limit);
    
            res.render('songs/songs', {
                formatSongs,
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

    /* GET /songs/create-song */
    createSong(req, res, next) {
        Promise.all([Singers.find({}), Albums.find({})])
            .then(([singers, albums]) => {
                res.render('songs/createSongs', {
                    singers: mutipleMongooseoObjectT(singers),
                    albums: mutipleMongooseoObjectT(albums),
                });
            })
            .catch(next);
    }
    /* [] */

    /* [POST] /songs/store */
    store = async (req, res, next) => {
        try {
            const { name, img, national, music, singer, album } = req.body;
            let slug = createSlug(name);
            let albumSlug = createSlug(album);
            const song = new Songs({
                name,
                img,
                national,
                singer,
                music,
                album,
                albumSlug,
                slug,
            });
            await song.save();
            res.redirect('/songs');
        } catch (error) {
            next(error);
        }
    };

    /* [GET] /songs/:id/edit */
    pageUpdate(req, res, next) {
        Promise.all([
            Singers.find({}),
            Albums.find({}),
            Songs.findById(req.params.id),
        ])
            .then(([singers, albums, song]) => {
                res.render('songs/updateSongs', {
                    song: mongooseToObject(song),
                    singers: mutipleMongooseoObjectT(singers),
                    albums: mutipleMongooseoObjectT(albums),
                });
            })
            .catch(next);
    }

    /* [PUT] /songs/:id */
    updateSong(req, res, next) {
        Songs.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/songs'))
            .catch(next);
    }

    /* [DELETE] /songs/:id */
    destroySong(req, res, next) {
        Songs.deleteOne({ _id: req.params.id })
            .then(() => {
                res.redirect('back');
            })
            .catch(next);
    }
}

module.exports = new SongsController();
