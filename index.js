// =============================================================================
//  This file is the entry point of the application
// =============================================================================

/* DEPENDENCIES */
//External packages
var express  = require('express');
var override = require('method-override');
var parser   = require('body-parser');
//var mongoose = require('mongoose');
var morgan   = require('morgan');
//var passport = require('passport');
//Internal dependencies
var routes = require("./app/routes");


/* SERVER CONFIG */
var app  = express();                //Inicializar express
var port = process.env.PORT || 3000; //Si se ha definido el puerto, leerlo. En caso contrario, usar el puerto 3000
//Middleware setup (order does matter)
app.use(express.static(__dirname + '/public')); //Indicar dónde están los ficheros publicos
app.use(morgan('dev')); //Establecer nivel de log 'dev'
app.use(parser.json());
app.use(parser.urlencoded({'extended': 'false'}));
app.use(parser.json({ type: 'application/vnd.api+json' }));
app.use(override());
//app.use(passport.initialize());
//Routes setup (order does matter)
app.use(routes);

/* SERVER START */
app.listen(port);
console.log("Something beautiful is happening on port " + port);