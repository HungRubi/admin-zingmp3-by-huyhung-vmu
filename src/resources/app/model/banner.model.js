const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const banner = new Schema(
    {
        songs_id: { 
            type: mongoose.Schema.Types.ObjectId, ref: 'songs', 
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String, 
            unique: true
        }
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('banner', banner);
