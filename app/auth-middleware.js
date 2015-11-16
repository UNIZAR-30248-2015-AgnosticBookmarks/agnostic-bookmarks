// =============================================================================
//  This file defines the middlewares that will authenticate the user. This
//  middlewares add a param 'user' to the request. If the user authenticates
//  successfully, user param will contain user data, otherwise user param will
//  be null. This param will be available for the middleware that comes after
//  this.
// =============================================================================

/* DEPENDENCIES */
User = require('./user-model');

// -----------------------------------------------------------------------------
//  BASIC AUTHENTICATON MIDDLEWARE (WITHOUT PASSPORT)
// -----------------------------------------------------------------------------
//  When using this authentication middleware, requests must include two custom
//  headers, one called 'username' with the user's name and another one called
//  'password' with the user's password.
// -----------------------------------------------------------------------------
var basicAuthMiddleware = function(req, res, next) {
    var username = req.headers.username;
    var password = req.headers.password;
    User.findOne({ username: username }, function(err, user) {
        if (err) {  // Query error
            req.params.internalError = err;
            next();
        }
        else if (!user) {  // User not found
            req.params.user = null;
            next();
        }
        else user.verifyPassword(password, function(err, match) { // User found
            if (err) req.params.internalError = err; // Query error
            else if (!match) req.params.user = null; // Password doesn't match
            else  req.params.user = user; // User found and password match
            next();
        });
    });
};

/* MODULE EXPORTS */
// -----------------------------------------------------------------------------
module.exports = {
    basic: basicAuthMiddleware
}
