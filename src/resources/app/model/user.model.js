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
        playlists: [{ type: Schema.Types.ObjectId, default: [] }],
        favoriteSongs: [{ type: Schema.Types.ObjectId, ref: 'Song', default: [] }],
        favoriteAlbums: [{ type: Schema.Types.ObjectId, ref: 'Album', default: [] }],
        recentlyPlayed: [{ type: Schema.Types.ObjectId, ref: 'Song', default: [] }], 
        lastLogin: { type: Date, default: Date.now },
        loginHistory: [{ type: Date, default: Date.now }],
        subscriptionPlan: { type: String, default: 'basic' },
    },
    {
        timestamps: true,
    },
);
module.exports = mongoose.model('users', users);
