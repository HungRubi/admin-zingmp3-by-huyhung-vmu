const Users = require('../model/user.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');

class UsersController {
    index(req, res, next) {
        Users.find({})
            .then((users) => {
                res.render('users', {
                    users: mutipleMongooseoObjectT(users),
                });
            })
            .catch(next);
    }
}

module.exports = new UsersController();
