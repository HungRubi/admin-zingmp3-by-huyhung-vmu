const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const users = new Schema(
    {
        username: String,
        password: String,
        quyenhan: String,
        email: String,
    },
    {
        timestamps: true,
    },
);
module.exports = mongoose.model('users', users);
