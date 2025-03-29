const Banner = require('../model/banner.model');
const Songs = require('../model/songs.model');
const Singer = require('../model/singers.model');
const Albums = require('../model/albums.model');
const Partnor = require('../model/partnor.model');
const {formatDate} = require('../../util/formatDate.util');
const {importDate} = require('../../util/importDate.util');
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
                ...item.toObject(),
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
}

module.exports = new apiGlobal();