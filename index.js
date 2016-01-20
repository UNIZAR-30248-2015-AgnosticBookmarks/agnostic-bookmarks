// =============================================================================
//  This file is the entry point of the application
// =============================================================================

/* DEPENDENCIES */
// -----------------------------------------------------------------------------
//External packages
var express  = require('express');          // Route management framework
var override = require('method-override');  // PUT, PATCH and DELETE methods
var parser   = require('body-parser');      // Parser for requests' body
var mongoose = require('mongoose');         // MongoDB driver for node
var morgan   = require('morgan');           // Request logger
//var passport = require('passport');         // Authentication middleware
//Internal dependencies
var routes = require("./app/routes");
var config = require("./app/config");


/* SERVER CONFIG */
// -----------------------------------------------------------------------------
var app  = express();                 // Initialise express application
var port = process.env.PORT || 3000;  // Read PORT from environment or use 3000

/* Middleware setup (order does matter) */
app.use(express.static(__dirname + '/public/dist')); // Set frontend files' path
// Log request if not testing
app.use(morgan('dev', {
    skip: function() { return process.env.NODE_ENV === 'test'; }
}));
// Middleware that will allow us to decode request parameteres
app.use(parser.json());
app.use(parser.urlencoded({'extended': 'false'}));
app.use(parser.json({ type: 'application/vnd.api+json' }));
app.use(override());
// Authentication middleware initialization (not used yet)
//app.use(passport.initialize());
// Last, add the routes to the application
app.use(routes);

/* DEFINE STARTUP AND SHUTDOWN FUNCTIONS */
// -----------------------------------------------------------------------------
var server;
function start(cb) {
    mongoose.connect(config.database);  // Connect to database through mongoose
    server = app.listen(port, function() {  // Start server activity
        console.log("Something beautiful is happening on port " + port);
        if (cb) cb();
    });
}
function close(cb) {
    mongoose.connection.close(function() {
        console.log('Terminated mongoose connection');
        server.close(function() {
            console.log('Shutting down the server');
            if (cb) cb();
        });
    });
};

module.exports = {
    start: start,
    close: close,
    database: mongoose
}

/* SERVER START */
start();
