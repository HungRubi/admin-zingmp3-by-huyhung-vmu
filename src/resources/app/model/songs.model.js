const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const songs = new Schema(
    {
        name: { type: String, required: true },
        img: String,
        singer: String,
        album: String,
        national: String,
        music: String,
        albumSlug: String,
        slug: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Songs', songs);
