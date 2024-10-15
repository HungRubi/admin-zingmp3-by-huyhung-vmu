const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mv = new Schema(
    {
        name: { type: String, unique: true },
        singer: String,
        img: String,
        video: String,
        slug: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('mv', mv);
