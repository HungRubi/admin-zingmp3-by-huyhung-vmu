const Albums = require('../model/albums.model');

class AlbumsApi {
    /* GET /api/allalbums */
    getAllAlbums(req, res, next) {
        Albums.find({})
            .then((albums) => {
                res.json(albums);
            })
            .catch(next);
    }

    /* GET /api/albumsmaylike */
    getAlbumsMayLike(req, res, next) {
        Albums.aggregate([
            { $match: { topic: 'có thể bạn muốn nghe' } },
            { $sample: { size: 5 } },
        ])
            .then((albums) => {
                res.json(albums);
            })
            .catch(next);
    }
    /* GET /api/albumsstorm */
    getAlbumsStorm(req, res, next) {
        Albums.aggregate([
            { $match: { topic: 'nhạc hot gây bão' } },
            { $sample: { size: 5 } },
        ])
            .then((albums) => {
                res.json(albums);
            })
            .catch(next);
    }

    /* GET /api/albumslistendance */
    getAlbumsListenDance(req, res, next) {
        Albums.aggregate([
            { $match: { topic: 'vừa nghe vừa lak' } },
            { $sample: { size: 5 } },
        ])
            .then((albums) => {
                res.json(albums);
            })
            .catch(next);
    }

    /* GET /api/albumschill */
    getAlbumsChill(req, res, next) {
        Albums.aggregate([
            { $match: { topic: 'Chill' } },
            { $sample: { size: 5 } },
        ])
            .then((albums) => {
                res.json(albums);
            })
            .catch(next);
    }

    /* GET /api/albumstop100 */
    getAlbumsTop100(req, res, next) {
        Albums.aggregate([
            { $match: { topic: 'top 100' } },
            { $sample: { size: 5 } },
        ])
            .then((albums) => {
                res.json(albums);
            })
            .catch(next);
    }

    /* GET /api/albumshot */
    getAlbumsHot(req, res, next) {
        Albums.aggregate([
            { $match: { topic: 'album hot' } },
            { $sample: { size: 5 } },
        ])
            .then((albums) => {
                res.json(albums);
            })
            .catch(next);
    }

    /* GET /api/albumsradio */
    getAlbumsRadio(req, res, next) {
        Albums.aggregate([
            { $match: { topic: 'radio nổi bật' } },
            { $sample: { size: 7 } },
        ])
            .then((albums) => {
                res.json(albums);
            })
            .catch(next);
    }

    /* GET albums/api/detailalbum/:slug */
    getDetailAlbum(req, res, next) {
        Albums.findOne({ slug: req.params.slug })
            .then((album) => {
                res.json(album);
            })
            .catch(next);
    }
}

module.exports = new AlbumsApi();
