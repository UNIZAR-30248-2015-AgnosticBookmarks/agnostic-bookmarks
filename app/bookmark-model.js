var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// DEFINE SCHEMA
BookmarkSchema = new mongoose.Schema({
    name  : { type: String, required: true },
    owner : { type: ObjectId, ref: 'User', required: true },
    url   : { type: String, required: true },
    description : String
});

// Check that the user does not own another bookmark pointing the same URL
// before saving the object
BookmarkSchema.pre('save', function(next) {
    var self = this;
    mongoose.models['Bookmark']
        .count({ owner: this.owner, url: this.url }, function(err, count) {
            if (err) throw err;
            if (count > 0) {
                self.invalidate('url', 'URL is already in use');
                next(new Error("URL is already in use"));
            } else {
                next();
            }
        });
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
