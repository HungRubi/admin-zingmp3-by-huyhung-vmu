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
}

module.exports = new SingerApi();
