const Users = require('../model/user.model');
const Songs = require('../model/songs.model');
const Albums = require('../model/albums.model');
const { mutipleMongooseoObjectT } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const mongoose = require('mongoose');
const {formatDate} = require('../../util/formatDate.util');
class UsersController {
    /* [GET] /users */
    async index(req, res, next) {
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let skip = (page - 1) * limit;
        let sortField = req.query.sort || 'fullname'; 
        let sortOrder = req.query.order === 'desc' ? -1 : 1; 
        try{
            const searchQuery = req.query.timkiem?.trim() || '';
            if (searchQuery) {
                const user = await Users.find({
                    fullname: { $regex: searchQuery, $options: 'i' }
                }).sort({ [sortField]: sortOrder }).lean();
    
                const userFormat = user.map(item => ({
                    ...item,
                    lastUpdate: formatDate(item.updatedAt)
                }));
    
                return res.render('users/users', {
                    searchType: true,
                    searchUser: userFormat,
                    searchQuery,
                    currentSort: sortField,
                    currentOrder: sortOrder === 1 ? 'asc' : 'desc'
                });
            } 
    
            const user = await Users.find()
                .skip(skip)
                .limit(limit)
                .sort({ [sortField]: sortOrder }) // Sắp xếp sản phẩm
                .lean();
    
            const userFormat = user.map(item => ({
                ...item,
                dateFormat: formatDate(item.updatedAt)
            }));
    
            const totalUser = await Users.countDocuments();
            const totalPage = Math.ceil(totalUser / limit);
    
            res.render('users/users', {
                userFormat,
                currentPage: page,
                totalPage,
                searchType: false,
                currentSort: sortField,
                currentOrder: sortOrder === 1 ? 'asc' : 'desc'
            });
        }catch(err){
            next(err);
        }
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
        if (req.body.playlistid) {
            req.body.playlistid = Array.isArray(req.body.playlistid)
                ? req.body.playlistid
                : [req.body.playlistid];

            req.body.favoriteSongs = req.body.playlistid.filter((id) =>
                mongoose.Types.ObjectId.isValid(id),
            );
        }

        if (req.body.favoriteAlbums) {
            req.body.favoriteAlbums = Array.isArray(req.body.favoriteAlbums)
                ? req.body.favoriteAlbums
                : [req.body.favoriteAlbums];

            req.body.favoriteAlbums = req.body.favoriteAlbums.filter((id) =>
                mongoose.Types.ObjectId.isValid(id),
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
        Users.findById(req.params.id)
            .then((user) => {
                return Promise.all([
                    user,
                    Songs.find({ _id: { $in: user.favoriteSongs } }),
                    Albums.find({}),
                    Songs.find({}),
                    Albums.find({ _id: { $in: user.favoriteAlbums } }),
                ]);
            })
            .then(([user, songs, albums, allsongs, favoriteAlbum]) => {
                res.render('users/detail', {
                    user: mongooseToObject(user),
                    songs: mutipleMongooseoObjectT(songs),
                    albums: mutipleMongooseoObjectT(albums),
                    allsongs: mutipleMongooseoObjectT(allsongs),
                    favoriteAlbum: mutipleMongooseoObjectT(favoriteAlbum),
                });
            })
            .catch(next);
    }
}

module.exports = new UsersController();
