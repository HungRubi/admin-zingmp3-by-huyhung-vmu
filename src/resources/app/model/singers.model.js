const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const singers = new Schema(
    {
        name: String,
        description: String,
        img: String,
        birth: String,
        stagename: String,
        slug: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Singers', singers);
