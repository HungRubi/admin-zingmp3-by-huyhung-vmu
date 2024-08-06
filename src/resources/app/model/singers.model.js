const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const singers = new Schema(
    {
        name: String,
        description: String,
        birth: String,
        stagename: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Singers', singers);
