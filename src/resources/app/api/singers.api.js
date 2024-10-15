const Singer = require('../model/singers.model');
const Song = require('../model/songs.model');
const Album = require('../model/albums.model');
const Mv = require('../model/mv.model');

class SingerApi {
    /* [GET] /singers/api/randomsingers */
    getRandomSinger(req, res, next) {
        Singer.aggregate([{ $sample: { size: 5 } }])
            .then((songs) => {
                res.json(songs);
            })
            .catch(next);
    }

    /* [GET] /singers/api/getsinger/:slug */
    getSingerSlug(req, res, next){
        Singer.findOne({slug: req.params.slug})
        .then(singer => {
            const name = singer.stagename;
            Song.aggregate([
                {$match: {singer: name}},
            ])
            .then(songs => {
                const albumNames = [...new Set(songs.map(song => song.album))];
                const albumsPromise = Album.aggregate([
                    { $match: {
                        $and: [
                            { name: { $in: albumNames } },
                            { name: { $regex: /\(Single\)/i } }
                        ]
                    }},
                    {$sample: {size: 5}}
                ]);
                const randomAlbumsPromise = Album.aggregate([
                    { $match: { name: { $in: albumNames } } },
                    { $sample: { size: 5 } }
                ]);
                const randomMV = Mv.aggregate([
                    { $match: { singer: singer.stagename } },
                    { $sample: { size: 3 } }
                ]);
                const getMvBySinger = Mv.aggregate([
                    { $match: { singer: singer.stagename } }
                ]);
                let stringSlug = `Những Bài Hát Hay Nhất Của ${singer.stagename.trim()}`;
                const getTop100 = Album.find({
                    name: { $regex: new RegExp(stringSlug, 'i') }
                })
                const getAllMvs = Mv.aggregate([
                    { $sample: { size: 16 } }
                ]);
                return Promise.all([albumsPromise, randomAlbumsPromise, randomMV, getTop100, getMvBySinger,getAllMvs])
                .then(([albums, randomAlbums, mvs, top100, mvsbysinger, getallmvs]) => {
                    res.json({
                        singer,
                        songs,
                        albums,
                        randomAlbums,
                        mvs,
                        top100,
                        mvsbysinger,
                        getallmvs
                    })
                })
            })

        })
        .catch(next);
    }
}

module.exports = new SingerApi();
