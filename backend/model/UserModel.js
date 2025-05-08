const conn = require('../connection/connection');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    images: { type: Buffer },
}, { timestamp: true });


const User = mongoose.model('user', userSchema);

module.exports = User


