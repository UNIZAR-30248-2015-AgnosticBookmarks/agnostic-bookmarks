var mongoose = require('mongoose');

// DEFINE SCHEMA
BookMarkSchema = new mongoose.Schema({
    name : { type: String, unique: true, required: true },
    username: { type: String, required: true },
    link: { type: String, required: true }
});


module.exports = mongoose.model('BookMark', BookMarkSchema);