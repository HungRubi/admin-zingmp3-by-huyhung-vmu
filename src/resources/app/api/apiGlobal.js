const Banner = require('../model/banner.model');
const Songs = require('../model/songs.model');
const Singer = require('../model/singers.model');
const Albums = require('../model/albums.model');
const Partnor = require('../model/partnor.model');
const Mv = require('../model/mv.model');
const Users = require('../model/user.model');
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
            const songVn = await Songs.find({national: "Việt Nam"}).limit(9);            
            const songQuocte = await Songs.find({national: "Quốc Tế"}).limit(9);            
            res.status(200).json({ 
                songVn,
                songQuocte,
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

    /** [GET] /api/songs/getall */
    async getAllSongs(req, res, next) {
        try{
            const songs = await Songs.find()
            res.status(200).json({
                songs
            })
        }catch(error){
            console.log(error);
            res.status(500).json(error)
        }
    }

    /** [POST] /api/songs/update-playlist/:id*/
    async updatePlayList(req, res, next) {
        const userId = req.params.id;
        const songId = req.body.songId;
        try{
            const user = await Users.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });
            const alreadyExists = user.favoriteSongs.includes(songId);

            if (alreadyExists) {
                return res.status(200).json({ message: "ID đã tồn tại trong playlist" });
            }
            user.favoriteSongs.push(songId);
            const songs = await Songs.find({
                _id: { $in: user.favoriteSongs }
            });
            await user.save();
            res.status(200).json({
                message: "Đã thêm vào playlist",
                favoriteSongs: songs
            });
        }catch(error){
            console.log(error);
            res.status(500).json(error)
        }
    }

    /** [DELETE] /api/songs/delete-playlist/:id*/
    async deleteFromPlayList(req, res, next) {
        const userId = req.params.id;
        const songId = req.body.songId;
    
        try {
            const user = await Users.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });
    
            const index = user.favoriteSongs.indexOf(songId);
    
            if (index === -1) {
                return res.status(200).json({ message: "Bài hát không tồn tại trong playlist" });
            }
    
            user.favoriteSongs.splice(index, 1); // Xóa bài hát
            await user.save();
            const songs = await Songs.find({
                _id: { $in: user.favoriteSongs }
            });
            res.status(200).json({
                message: "Đã xóa bài hát khỏi playlist",
                favoriteSongs: songs
            });
    
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    /** [POST] /api/albums/update-favorite-album/:id*/
    async updateFavoriteAlbums(req, res, next) {
        const userId = req.params.id;
        const albumId = req.body.albumId;
        try{
            const user = await Users.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });
            const alreadyExists = user.favoriteAlbums.includes(albumId);

            if (alreadyExists) {
                return res.status(200).json({ message: "ID đã tồn tại trong danh sách album" });
            }
            user.favoriteAlbums.push(albumId);
            const songs = await Albums.find({
                _id: { $in: user.favoriteAlbums }
            });
            await user.save();
            res.status(200).json({
                message: "Đã thêm vào danh sách album",
                favoriteAlbums: songs
            });
        }catch(error){
            console.log(error);
            res.status(500).json(error)
        }
    }
    
    /** [DELETE] /api/albums/delete-favorite-album/:id*/
    async deleteFavoriteAlbums(req, res, next) {
        const userId = req.params.id;
        const albumId = req.body.albumId;
    
        try {
            const user = await Users.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });
    
            const index = user.favoriteAlbums.indexOf(albumId);
    
            if (index === -1) {
                return res.status(200).json({ message: "Bài hát không tồn tại trong playlist" });
            }
    
            user.favoriteAlbums.splice(index, 1); // Xóa bài hát
            await user.save();
            const songs = await Albums.find({
                _id: { $in: user.favoriteAlbums }
            });
            res.status(200).json({
                message: "Đã xóa bài hát khỏi playlist",
                favoriteAlbums: songs
            });
    
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    /** [POST] /api/singers/update-favorite-singer/:id*/
    async updateFavoriteSinger(req, res, next) {
        const userId = req.params.id;
        const singerId = req.body.singerId;
        try{
            const user = await Users.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });
            const alreadyExists = user.favoriteSingers.includes(singerId);

            if (alreadyExists) {
                return res.status(200).json({ message: "Ca sĩ này đã có trong danh sách rồi" });
            }
            user.favoriteSingers.push(singerId);
            const singer = await Singer.find({
                _id: { $in: user.favoriteSingers }
            });
            await user.save();
            res.status(200).json({
                message: "Đã thêm vào ca sĩ vào danh sách yêu thích",
                favoriteSingers: singer
            });
        }catch(error){
            console.log(error);
            res.status(500).json(error)
        }
    }

    /** [POST] /api/albums/delete-favorite-singer/:id*/
    async deleteFavoriteSinger(req, res, next) {
        const userId = req.params.id;
        const singerId = req.body.singerId;
    
        try {
            const user = await Users.findById(userId);
            if (!user) return res.status(404).json({ message: "Vui lòng đăng nhập" });
    
            const index = user.favoriteSingers.indexOf(singerId);
    
            if (index === -1) {
                return res.status(200).json({ message: "Ca sĩ này chưa có trong danh sách" });
            }
    
            user.favoriteSingers.splice(index, 1); // Xóa bài hát
            await user.save();
            const singer = await Singer.find({
                _id: { $in: user.favoriteSingers }
            });
            res.status(200).json({
                message: "Đã xóa ca sĩ khỏi danh sách yêu thích",
                favoriteSingers: singer
            });
    
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    /** [GET] /api/search?search */
    async querySearch(req, res, next) {
        try {
            const { s } = req.query;
            const search = String(s || "").trim();
    
            // 1. Truy vấn lần đầu
            let [songs, albums, singers, mv] = await Promise.all([
                Songs.find({ name: { $regex: search, $options: 'i' } }),
                Albums.find({ name: { $regex: search, $options: 'i' } }),
                Singer.find({ stagename: { $regex: search, $options: 'i' } }),
                Mv.find({ name: { $regex: search, $options: 'i' } }),
            ]);
    
            // 2. Nếu songs rỗng
            if (songs.length === 0) {
                if (singers.length > 0) {
                    const singerNames = [...new Set(singers.map(s => s.stagename))];
                    songs = await Songs.find({ singer: { $in: singerNames } });
                } else if (albums.length > 0) {
                    const albumNames = [...new Set(albums.map(a => a.name))];
                    songs = await Songs.find({ album: { $in: albumNames } });
                } else if (mv.length > 0) {
                    const mvSingers = [...new Set(mv.map(m => m.singer))];
                    songs = await Songs.find({ singer: { $in: mvSingers } });
                }
            }
    
            // 3. Nếu singers rỗng
            if (singers.length === 0) {
                if (songs.length > 0) {
                    const songSingers = [...new Set(songs.map(s => s.singer))];
                    singers = await Singer.find({ stagename: { $in: songSingers } });
                } else if (albums.length > 0) {
                    const albumNames = [...new Set(albums.map(a => a.name))];
                    const songsByAlbum = await Songs.find({ album: { $in: albumNames } });
                    const songSingers = [...new Set(songsByAlbum.map(s => s.singer))];
                    singers = await Singer.find({ stagename: { $in: songSingers } });
                } else if (mv.length > 0) {
                    const mvSingers = [...new Set(mv.map(m => m.singer))];
                    singers = await Singer.find({ stagename: { $in: mvSingers } });
                }
            }
    
            // 4. Nếu albums rỗng
            if (albums.length === 0) {
                if (songs.length > 0) {
                    const albumNames = [...new Set(songs.map(s => s.album))];
                    albums = await Albums.find({ name: { $in: albumNames } });
                } else if (singers.length > 0) {
                    const singerNames = [...new Set(singers.map(s => s.stagename))];
                    const songsBySinger = await Songs.find({ singer: { $in: singerNames } });
                    const albumNames = [...new Set(songsBySinger.map(s => s.album))];
                    albums = await Albums.find({ name: { $in: albumNames } });
                } else if (mv.length > 0) {
                    const mvSingers = [...new Set(mv.map(m => m.singer))];
                    const songsByMvSinger = await Songs.find({ singer: { $in: mvSingers } });
                    const albumNames = [...new Set(songsByMvSinger.map(s => s.album))];
                    albums = await Albums.find({ name: { $in: albumNames } });
                }
            }
    
            // 5. Nếu mv rỗng
            if (mv.length === 0) {
                if (songs.length > 0) {
                    const songSingers = [...new Set(songs.map(s => s.singer))];
                    mv = await Mv.find({ singer: { $in: songSingers } });
                } else if (singers.length > 0) {
                    const singerNames = [...new Set(singers.map(s => s.stagename))];
                    mv = await Mv.find({ singer: { $in: singerNames } });
                } else if (albums.length > 0) {
                    const albumNames = [...new Set(albums.map(a => a.name))];
                    const songsByAlbum = await Songs.find({ album: { $in: albumNames } });
                    const songSingers = [...new Set(songsByAlbum.map(s => s.singer))];
                    mv = await Mv.find({ singer: { $in: songSingers } });
                }
            }
            const singerSuggest = await Singer.aggregate([{ $sample: { size: 5 } }]);
            res.status(200).json({
                songs,
                albums,
                singers,
                mv,
                singerSuggest
            });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
    
}

module.exports = new apiGlobal();