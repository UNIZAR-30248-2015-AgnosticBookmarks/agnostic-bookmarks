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

/* AUTH HANDLER MIDDLEWARE */
/* This function redirects the user to a non authorized status (401) when no
 * valid credentials are provided. Use only on the endpoints where the user MUST
 * be authenticated. This middleware DOES NOT read user credentials, so it
 * depends on another middleware that actually does it. That middleware must
 * be executed before this one.
 */
function routesHandler(req, res, next) {
    if (req.params.internalError) {
        res.status(500).send(req.params.internalError);
    }
    else if (req.params.user == null) {
        res.status(401).send({"message": "Invalid username or password"});
    }
    else {
        next();
    }
}


/* MODULE EXPORTS */
// -----------------------------------------------------------------------------
module.exports = {
    basicMiddleware: basicAuthMiddleware,
    routesHandler: routesHandler
}
