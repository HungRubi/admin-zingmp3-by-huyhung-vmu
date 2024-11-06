const Users = require('../model/user.model');
const Songs = require('../model/songs.model');
const Albums = require('../model/albums.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
class UsersController {
    /* [GET] /users */
    index(req, res, next) {
        Users.find({})
            .then((users) => {
                res.render('users/users', {
                    users: mutipleMongooseoObjectT(users),
                });
            })
            .catch(next);
    }

    /* [GET] /users/create */
    createUser(req, res, next) {
        res.render('users/createUsers');
    }

    /* [POST] user/store */
    store = async (req, res, next) => {
        try {
            const formData = req.body;
            const user = new Users(formData);
            await user.save();
            res.redirect('/users');
        } catch (error) {
            next(error);
        }
    };

    /* [GET] users/:id/edit */
    editUser(req, res, next) {
        Users.findById(req.params.id)
            .then((user) => {
                res.render('users/updateUsers', {
                    user: mongooseToObject(user),
                });
            })
            .catch(next);
    }

    /* [PUT] users/:id */
    updateUser(req, res, next) {
        console.log(req.body.playlists); // In ra giá trị playlists nhận được

        // Kiểm tra nếu playlists không phải là undefined hoặc null
        if (req.body.playlists) {
            // Nếu playlists là một chuỗi, chuyển đổi nó thành mảng
            if (typeof req.body.playlists === 'string') {
                req.body.playlists = [req.body.playlists];
            }

            // Lọc các giá trị không hợp lệ (chuỗi rỗng)
            req.body.playlists = req.body.playlists.filter(
                (id) => id && mongoose.Types.ObjectId.isValid(id),
            );
        }
        Users.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                res.redirect('/users');
            })
            .catch(next);
    }

    /* [DELETE] users/:id */
    deleteUser(req, res, next) {
        Users.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    /* [GET] users/:id */
    userDetail(req, res, next) {
        Promise.all([
            Users.findById(req.params.id),
            Songs.find({}),
            Albums.find({}),
        ])
            .then(([user, songs, albums]) => {
                res.render('users/detail', {
                    user: mongooseToObject(user),
                    songs: mutipleMongooseoObjectT(songs),
                    albums: mutipleMongooseoObjectT(albums),
                });
            })
            .catch((err) => {
                next(err);
            });
    }
}

module.exports = new UsersController();
