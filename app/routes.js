// =============================================================================
//  This file defines the endpoints for the RESTFul API and the routes for the
//  application.
// =============================================================================

var express = require('express');
var auth    = require('./auth-middleware');
var User    = require('./user-model');

var authMiddleware = auth.basicMiddleware;
var authRouter     = auth.basicMiddleware;

/* API ROUTES */
// -----------------------------------------------------------------------------
var apiRoutes = express.Router();

//Enable Cross Origin Requests (only for the API)
apiRoutes.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// API entry point
apiRoutes.get('/', function(req, res) {
    res.json('Welcome to the coolest API this side of the Mississippi :D');
});

// Users endpoint
apiRoutes.route('/users')
    // Add a new user
    .post(function(req, res){
        new User({
            username: req.body.username,
            password: req.body.password
        }).save(function(err, data){
            if (err) res.status(500).send(err);
            else res.json(data);
        });
    });

// Auth endpoint
apiRoutes.route('/auth')
    // Check the credentials of a user
    .get(authMiddleware, authRouter, function(req, res){
        res.json(req.params.user);
    });

/* GLOBAL ROUTES */
// -----------------------------------------------------------------------------
// API endpoints go under '/api' route. Other routes are redirected to
// index.html where AngularJS will handle frontend routes.
var routes = express.Router();
routes.use('/api', apiRoutes);
routes.get('*', function(req, res) {
    console.log(__dirname);
    res.sendFile('index.html', {'root': 'public/dist'});
});

module.exports = routes;
