const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const albums = new Schema(
    {
        name: { type: String, unique: true },
        description: String,
        img: String,
        slug: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('albums', albums);
