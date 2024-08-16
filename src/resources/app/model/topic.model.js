const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topic = new Schema(
    {
        name: { type: String, unique: true },
        title: String,
        slug: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('topic', topic);
