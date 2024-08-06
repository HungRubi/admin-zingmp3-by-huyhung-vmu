const Singers = require('../model/singers.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');

class SingerController {
    index(req, res, next) {
        Singers.find({})
            .then((singers) => {
                console.log(singers);
                res.render('singers', {
                    singers: mutipleMongooseoObjectT(singers),
                });
            })
            .catch(next);
    }
}

module.exports = new SingerController();
