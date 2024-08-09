const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const users = new Schema(
    {
        username: { type: String, unique: true },
        password: String,
        fullname: String,
        img: String,
        address: String,
        phone: { type: String, unique: true },
        quyenhan: String,
        email: { type: String, unique: true },
    },
    {
        timestamps: true,
    },
);
module.exports = mongoose.model('users', users);
