const Partnor = require('../model/partnor.model');

class PartnorApi {
    /* [GET] /partnors/api/getpartnor */
    getApiPartnor(req, res, next) {
        Partnor.find()
            .then((partnor) => {
                res.json(partnor);
            })
            .catch(next);
    }
}

module.exports = new PartnorApi();
