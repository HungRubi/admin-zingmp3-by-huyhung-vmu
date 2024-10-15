const Mv = require('../model/mv.model');

class MvApi{

    /* [GET] /mv/api/getmv/:slug */
    getMvSlug(req, res, next) {
        Mv.find({slug: req.params.slug})
        .then(mv => {
            res.json(mv);
        })
        .catch(next)
    }
}

module.exports = new MvApi();