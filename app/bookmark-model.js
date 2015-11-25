var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var ValidationError = mongoose.Error.ValidationError;
var ValidatorError  = mongoose.Error.ValidatorError;

// DEFINE SCHEMA
BookmarkSchema = new mongoose.Schema({
    name  : { type: String, required: true },
    owner : { type: ObjectId, ref: 'User', required: true },
    url   : { type: String, required: true },
    description : String,
    created_at  : { type: Date, required: true, default: Date.now }
});

// Check that the user does not own another bookmark pointing the same URL
// before saving the object
BookmarkSchema.pre('validate', function(next) {
    var self = this;
    mongoose.models['Bookmark']
        .count({ owner: this.owner, url: this.url }, function(err, count) {
            if (err) throw err;
            if (count > 0) self.invalidate('url', 'URL is already in use');
            next();
        });
});

// Check if a userId corresponds with the owner of the bookmark
BookmarkSchema.methods.verifyOwnership = function(userId, callback) {
    callback(null, this.owner.equals(userId));
}

module.exports = mongoose.model('Bookmark', BookmarkSchema);
