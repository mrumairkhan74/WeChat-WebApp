const mongoose = require('mongoose');
require('dotenv').config();


const conn = mongoose.connect(process.env.MONGO_URI);
conn.then(() => {
    console.log("Db Connection")
})

conn.catch(() => {
    console.log("Db not Connected")
});



module.exports = conn