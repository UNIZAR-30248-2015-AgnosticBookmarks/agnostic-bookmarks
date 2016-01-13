var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// DEFINE SCHEMA
UserSchema = new mongoose.Schema({
    username : { type: String, unique: true, required: true },
    password : { type: String, required: true }
});

// Before each user.save() call
UserSchema.pre('save', function(callback) {
    // Hash password if it has changed
    var self = this;
    if (self.isModified('password')) bcrypt.genSalt(5, function(err, salt) {
        if (err) callback(err)
        else bcrypt.hash(self.password, salt, null, function (err, hash) {
            if (err) callback(err)
            else { self.password = hash; callback(); }
        })
    });
    else callback();
});

// Verify password
UserSchema.methods.verifyPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function (err, matchSuccess) {
        if (err) callback(err);
        else callback(null, matchSuccess);
    });
}

module.exports = mongoose.model('User', UserSchema);
