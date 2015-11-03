// =============================================================================
//  This file is the entry point of the application
// =============================================================================

/* DEPENDENCIES */
//External packages
var express  = require('express');          // Route management framework
var override = require('method-override');  // PUT, PATCH and DELETE methods
var parser   = require('body-parser');      // Parser for requests' body
var mongoose = require('mongoose');         // MongoDB driver for node
var morgan   = require('morgan');           // Request logger
//var passport = require('passport');
//Internal dependencies
var routes = require("./app/routes");
var config = require("./app/config");


/* SERVER CONFIG */
var app  = express();                 // Initialise express application
var port = process.env.PORT || 3000;  // Read PORT from environment or use 3000
//Middleware setup (order does matter)
app.use(express.static(__dirname + '/public')); // Set frontend files' path
app.use(morgan('dev')); // Set log level to 'dev'
app.use(parser.json());
app.use(parser.urlencoded({'extended': 'false'}));
app.use(parser.json({ type: 'application/vnd.api+json' }));
app.use(override());
//app.use(passport.initialize());
//Routes setup (order does matter)
app.use(routes);

/* SERVER START */
mongoose.connect(config.database);  // Connect to database through mongoose
app.listen(port);                   // Start server activity
console.log("Something beautiful is happening on port " + port);
