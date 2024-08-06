const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songs = new Schema(
    {
        name: String,
        img: String,
        singer: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Songs', songs);
