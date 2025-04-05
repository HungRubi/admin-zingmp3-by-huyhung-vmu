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
            Singers.find().sort({ name: 1 }),
            Albums.find().sort({ name: 1 }),
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
    async updateSong(req, res, next) {
        try {
            console.log(req.body);
            if (req.body.name) {
                req.body.slug = createSlug(req.body.name);
            }
            if(req.body.album) {
                req.body.albumSlug = createSlug(req.body.album)
            }
            await Songs.updateOne({ _id: req.params.id }, req.body);
            res.redirect('/songs');
        } catch (error) {
            console.log(error);
        }
    }
    
    async updateSongs(req, res, next) {
        try {
            // Lấy tất cả bài hát chưa có albumSlug
            const songsWithoutSlug = await Songs.find({ albumSlug: { $exists: false } });
    
            for (let song of songsWithoutSlug) {
                if (!song.album) continue; // Bỏ qua nếu không có album
    
                // Tìm album theo tên
                const album = await Albums.findOne({ name: song.album });
    
                if (album) {
                    await Songs.updateOne(
                        { _id: song._id },
                        { $set: { albumSlug: album.slug } }
                    );
                }
            }
    
            res.json({ message: "Cập nhật albumSlug thành công!" });
        } catch (error) {
            console.error("Lỗi khi cập nhật albumSlug:", error);
            res.status(500).json({ message: "Có lỗi xảy ra!", error });
        }
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
