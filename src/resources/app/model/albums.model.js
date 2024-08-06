const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const albums = new Schema(
    {
        name: String,
        img: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('albums', albums);
