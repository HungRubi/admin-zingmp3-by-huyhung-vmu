const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const users = new Schema(
    {
        username: { type: String, unique: true },
        password: String,
        fullname: String,
        img: String,
        address: String,
        phone: { type: String, unique: true },
        quyenhan: String,
        email: { type: String, unique: true },
        favoriteSongs: [{ type: String, default: [] }],
        favoriteAlbums: [{ type: String, default: [] }],
        favoriteSingers: [{ type: String, default: [] }],
        recentlyPlayed: [{ type: String, default: [] }],
        lastLogin: { type: Date, default: Date.now },
        loginHistory: [{ type: Date, default: Date.now }],
        subscriptionPlan: { type: String, default: 'basic' },
    },
    {
        timestamps: true,
    },
);
module.exports = mongoose.model('users', users);
