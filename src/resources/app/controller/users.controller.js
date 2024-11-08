const Users = require('../model/user.model');
const Songs = require('../model/songs.model');
const Albums = require('../model/albums.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const mongoose = require('mongoose'); 
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
        console.log(req.body.playlistid); // Log for debugging

    if (req.body.playlistid) {
        req.body.playlistid = Array.isArray(req.body.playlistid) 
            ? req.body.playlistid 
            : [req.body.playlistid];

        req.body.favoriteSongs = req.body.playlistid
            .filter(id => mongoose.Types.ObjectId.isValid(id));
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
        Users.findById(req.params.id)
            .then(user => {
                return Promise.all([
                    user,
                    Songs.find({ _id: { $in: user.favoriteSongs } }),
                    Albums.find({}),
                    Songs.find({})
                ]);
            })
            .then(([user, songs, albums, allsongs]) => {
                res.render('users/detail', {
                    user: mongooseToObject(user),
                    songs: mutipleMongooseoObjectT(songs),
                    albums: mutipleMongooseoObjectT(albums),
                    allsongs: mutipleMongooseoObjectT(allsongs)
                });
            })
            .catch(next);
    }
    
}

module.exports = new UsersController();
