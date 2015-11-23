var mongoose = require('mongoose');

// DEFINE SCHEMA

Label = new mongoose.Schema({
    name : String
});

BookMarkSchema = new mongoose.Schema({
    name : { type: String, unique: true, required: true },
    username: { type: String, required: true },
    link: { type: String, required: true },
    labels: [Label],
    description: String
});

//Check if username and link already exists in collection BookMark
BookMarkSchema.methods.exists = function(username, link, callback) {
    callback(BookMark.count({username: username, link: link})>0);
}

module.exports = mongoose.model('BookMark', BookMarkSchema);