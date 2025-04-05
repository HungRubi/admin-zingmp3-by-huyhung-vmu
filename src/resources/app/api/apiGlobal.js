const Banner = require('../model/banner.model');
const Songs = require('../model/songs.model');
const Singer = require('../model/singers.model');
const Albums = require('../model/albums.model');
const Partnor = require('../model/partnor.model');
const Mv = require('../model/mv.model');
const {formatDate} = require('../../util/formatDate.util');
const {importDate} = require('../../util/importDate.util');
const {mutipleMongooseoObjectT, mongooseToObject} = require('../../util/mongoose')
class apiGlobal {

    /** [GET] /api/home */
    async getHome(req, res, next) {
        try {
            const banners = await Banner.find().limit(6);
            const songIds = banners.map(b => b.songs_id); 
            const songs = await Songs.find({ _id: { $in: songIds } });
            const bannerFormat = banners.map(b => ({
                ...b.toObject(),
                song: songs.find(s => s._id.toString() === b.songs_id.toString()) || null
            }));

            const songSuggest = await Songs.aggregate([{ $sample: { size: 9 } }])
            const songNew = await Songs.aggregate([{ $sample: { size: 9 } }])
    
            const randumSinger = await Singer.aggregate([{ $sample: { size: 1 } }]);
            const songForFan = await Songs.find({singer: randumSinger[0].stagename}).limit(5);

            const topSong = await Songs.find({singer: "Sơn Tùng MTP"}).limit(8);
            const formatSong = topSong.map(item => ({
                ...item.toObject(``),
                format: importDate(item.updatedAt)
            }))

            const top100= await Albums.aggregate([
                        { $match: { topic: 'top 100' } },
                        { $sample: { size: 5 } },
            ]);

            const canSonglisten= await Albums.aggregate([
                { $match: { topic: 'có thể bạn muốn nghe' } },
                { $sample: { size: 5 } },
            ]);

            const albumHot= await Albums.aggregate([
                { $match: { topic: 'album hot' } },
                { $sample: { size: 5 } },
            ]);
            const albumChill= await Albums.aggregate([
                { $match: { topic: 'Chill' } },
                { $sample: { size: 5 } },
            ]);
            const radio = await Albums.aggregate([
                { $match: { topic: 'radio nổi bật' } },
                { $sample: { size: 7 } },
            ]);

            const partnor = await Partnor.find();
                        
            res.status(200).json({ 
                topSong: formatSong,
                albumChill,
                banners: bannerFormat,
                songSuggest: songSuggest,
                songNew: songNew,
                randumSinger: randumSinger[0],
                songForFan, 
                top100,
                canSonglisten,
                albumHot,
                partnor,
                radio,
            });
    
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    /** [GET] /api/album/:slug */
    async getAlbumDetail(req, res, next) {
        try{
            const album = await Albums.findOne({slug: req.params.slug})
            if (!album) {
                return res.status(500).json({ message: "Album not found" });
            }
            const formatAlbum = {
                ...album.toObject(),
                format: formatDate(album.updatedAt)
            }
            const songs = await Songs.find({ album: album.name.trim() });

            if (!songs || songs.length === 0) {
                return res.status(500).json({ message: "Songs not found" });
            }

            const singers = [...new Set(songs.map(song => song.singer).filter(Boolean))];

            if (singers.length > 2) {
                const uniqueSingers = singers.slice(0, 2);
            
                if (uniqueSingers.length < 2 || uniqueSingers[0] === uniqueSingers[1]) {
                    // Nếu chỉ có 1 ca sĩ hoặc 2 ca sĩ giống nhau
                    const singerData = await Singer.find({ stagename: { $in: singers } });
                    return res.json({ singers: singerData });
                }
                const singerData = await Singer.find({ stagename: { $in: uniqueSingers } });
            }
            
            const singerData = await Singer.find({ stagename: { $in: singers } });

            const singerSuggest = await Singer.aggregate([{ $sample: { size: 5 } }]);
            const albumSuggest = await Albums.aggregate([{ $sample: { size: 5 } }]);
            res.status(200).json({
                album: formatAlbum,
                songs: mutipleMongooseoObjectT(songs),
                singer: singerData,
                singerSuggest,
                albumSuggest
            })
        }catch(error){
            console.log(error)
            res.status(500).json(error)
        }
    }

    /** [GET] /api/singer/:slug */
    async getSingerDetail(req, res, next) {
        try{
            const singer = await Singer.findOne({slug: req.params.slug});
            if (!singer) {
                return res.status(404).json({ message: "Ca sĩ không tồn tại!" });
            }
            const songs = await Songs.find({singer: singer.stagename});
            const albumNames = [...new Set(songs.map(song => song.album))];
            const albumsPromise = await Albums.aggregate([
                { $match: {
                    $and: [
                        { name: { $in: albumNames } },
                        { name: { $regex: /\(Single\)/i } }
                    ]
                }},
                { $sample: { size: 5 } }
            ]);
            const filteredAlbumNames = albumNames.filter(name => !name.includes("(Single)"));

            const randomAlbumsPromise = await Albums.aggregate([
                { $match: { name: { $in: filteredAlbumNames } } },
                { $sample: { size: 5 } }
            ]);

            let stringSlug = `Những Bài Hát Hay Nhất Của ${singer.stagename.trim()}`;
            const getTop100 = await Albums.find({
                name: { $regex: new RegExp(stringSlug, 'i') }
            })
            const singerSuggest = await Singer.aggregate([{ $sample: { size: 5 } }]);
            const randomMV = await Mv.aggregate([
                { $match: { singer: singer.stagename } },
            ]);
            res.status(200).json({
                singer,
                randomMV,
                singerSuggest,
                getTop100,
                albums2: randomAlbumsPromise,
                songs,
                albums: albumsPromise,
            })
        }catch(error){
            console.log(error)
            res.status(500).json(error)
        }
    }

    /** [GET] /api/mv/:slug */
    async getMvDetail(req, res, next) {
        try{
            const mv = await Mv.findOne({slug: req.params.slug});
            const mvs = await Mv.find();
            const singer = await Singer.findOne({stagename: mv.singer});
            const mvForSinger = await Mv.find({singer: singer.stagename});
            res.status(200).json({
                mvForSinger,
                singer,
                mv,
                mvs,
            })
        }catch(error){
            console.log(error);
            res.status(500).json(error)
        }
    }

    /** [GET] /api/bxh */
    async getBXH(req, res, next) {
        try{
            const allSong = await Songs.find()
            res.status(200).json({
                songs: allSong
            })
        }catch(error){
            console.log(error);
            res.status(500).json(error)
        }
    }

    /** [GET] /api/bxh */
    async getTop100(req, res, next) {
        try{
            const albums = await Albums.find({ name: /Top 100/i });
            res.status(200).json({
                albums
            })
        }catch(error){
            console.log(error);
            res.status(500).json(error)
        }
    }
}

module.exports = new apiGlobal();