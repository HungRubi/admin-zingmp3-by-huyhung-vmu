const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partnor = new Schema(
    {
        img: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('partnor', partnor);
