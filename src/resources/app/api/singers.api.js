const Singer = require('../model/singers.model');

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
            res.json(singer)
        })
        .catch(next);
    }
}

module.exports = new SingerApi();
