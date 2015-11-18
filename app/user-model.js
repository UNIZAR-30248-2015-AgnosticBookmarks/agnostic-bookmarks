var mongoose = require('mongoose');

// DEFINE SCHEMA
UserSchema = new mongoose.Schema({
    username : { type: String, unique: true, required: true },
    password : { type: String, required: true }
});

UserSchema.methods.verifyPassword = function(password, callback) {
    callback(null, this.password === password);
}

module.exports = mongoose.model('User', UserSchema);
