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
        playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
        favoriteSongs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
        favoriteAlbums: [{ type: Schema.Types.ObjectId, ref: 'Album' }],
        recentlyPlayed: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
        lastLogin: { type: Date },
        loginHistory: [{ type: Date }],
        subscriptionPlan: { type: String, default: 'free' },
    },
    {
        timestamps: true,
    },
);
module.exports = mongoose.model('users', users);
