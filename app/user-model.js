/**
 * Created by ramon on 31/10/2015.
 */
var mongoose = require('mongoose');

// DEFINE SCHEMA
UserSchema = new mongoose.Schema({
    username : { type: String, unique: true, required: true },
    password : { type: String, required: true }
});

UserSchema.methods.verifyPassword = function(password, callback) {
    callback(this.password === password);
}

module.exports = mongoose.model('User', UserSchema);