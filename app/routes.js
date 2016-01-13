// =============================================================================
//  This file defines the endpoints for the RESTFul API and the routes for the
//  application.
// =============================================================================

var express  = require('express');
var auth     = require('./auth-middleware');
var User     = require('./user-model');
var Bookmark = require('./bookmark-model');

var authMiddleware = auth.httpBasicMiddleware;
var authRouter     = auth.routesHandler;

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
    .post(function(req, res) {
        new User({
            username: req.body.username,
            password: req.body.password
        }).save(function(err, data) {
            if (err) res.status(500).send(err);
            else res.json(data);
        });
    });

// Auth endpoint
apiRoutes.route('/auth')
    // Check the credentials of a user
    .get(authMiddleware, authRouter, function(req, res) {
        res.json(req.user);
    });

// Bookmarks endpoints
apiRoutes.route('/bookmarks')
    // Get the whole bookmarks collection of a user
    .get(authMiddleware, authRouter, function(req, res) {
        var sortCriteria, offset, pageSize;
        var errors = [];
        
        if (req.query.sortBy && req.query.sortBy === 'name') sortCriteria = 'name';
        else if (!req.query.sortBy || req.query.sortBy === 'date') sortCriteria = '-created_at';
        else errors.push({"sortBy": "Wrong 'sortBy' criteria"});

        offset = req.query.offset || 0;
        if (offset < 0)
            errors.push({"offset": "'offset' must be greater than 0"});

        pageSize = req.query.pageSize || 10;
        if (pageSize < 0)
            errors.push({"pageSize": "'pageSize'  must be greater than 0"});
        else if (pageSize > 100)
            errors.push({"pageSize": "'pageSize'  must be lower than 100"});

        if (errors.length > 0) res.status(400).json({"errors": errors});
        else Bookmark.find(
            { owner: req.user },
            null,
            { sort: sortCriteria, skip: (offset*pageSize), limit: pageSize },
            function(err, data) {
                if (err) res.status(500).send(err);
                else res.json(data);
            });
    })
    // Add a bookmark to a user's collection
    .post(authMiddleware, authRouter, function(req, res) {
        new Bookmark({
            name: req.body.name,
            owner: req.user,
            url: req.body.url,
            description: req.body.description
        }).save(function(err, data) {
            if (err && err.name == 'ValidationError') res.status(409).send(err);
            else if (err) res.status(500).send(err);
            else res.json(data);
        });
    })

apiRoutes.route('/bookmarks/search')
    .get(authMiddleware, authRouter, function(req, res) { 
        var sortCriteria, offset, pageSize, searchQuery;
        var errors = [];
        
        if (req.query.sortBy && req.query.sortBy === 'name') sortCriteria = 'name';
        else if (!req.query.sortBy || req.query.sortBy === 'date') sortCriteria = '-created_at';
        else errors.push({"sortBy": "Wrong 'sortBy' criteria"});

        offset = req.query.offset || 0;
        if (offset < 0)
            errors.push({"offset": "'offset' must be greater than 0"});

        pageSize = req.query.pageSize || 10;
        if (pageSize < 0)
            errors.push({"pageSize": "'pageSize'  must be greater than 0"});
        else if (pageSize > 100)
            errors.push({"pageSize": "'pageSize'  must be lower than 100"});

        searchQuery = req.query.search;
        if (searchQuery == null)
            errors.push({"searchQuery": "'searchQuery' required"})

        if (errors.length > 0) res.status(400).json({"errors": errors});
        else Bookmark.find(
            { $and: [
                    { owner: req.user },
                    { $or: [
                        { name: { $regex: searchQuery, $options: 'i'} },
                        { description: { $regex: searchQuery, $options: 'i'} }
                    ]}
            ]},
            null,
            { sort: sortCriteria, skip: (offset*pageSize), limit: pageSize },
            function(err, data) {
                if (err) res.status(500).send(err);
                else res.json(data);
            });
    })

apiRoutes.route('/bookmarks/:bookmarkId')
    // Get single bookmark
    .get(authMiddleware, authRouter, function(req, res) {
        Bookmark.findById(req.params.bookmarkId, function(err, bookmark) {
            if (err) res.status(500).send(err);
            else if (bookmark == null) res.status(404).send("Not found");
            else bookmark.verifyOwnership(req.user,
                    function(err, accessGranted) {
                if (err) res.status(500).send(err); // Should never enter
                else if (!accessGranted) res.status(401).send("Not authorized");
                else res.json(bookmark);
            });
        });
    })
    // Update single bookmark
    .patch(authMiddleware, authRouter, function(req, res) {
        Bookmark.findById(req.params.bookmarkId, function(err, bookmark) {
            if (err) res.status(500).send(err);
            else if (bookmark == null) res.status(404).send("Not found");
            else bookmark.verifyOwnership(req.user,
                    function(err, accessGranted) {
                if (err) res.status(500).send(err); // Should never enter
                else if (!accessGranted) res.status(401).send("Not authorized");
                else {
                    if (req.body.name) bookmark.name = req.body.name;
                    if (req.body.url) bookmark.url = req.body.url;
                    if (req.body.description)
                        bookmark.description = req.body.description;
                    bookmark.save(function(err, data) {
                       if (err) res.status(500).send(err);
                       else res.json(bookmark);
                    });;
                }
            });
        });
    })
    // Remove single  bookmark
    .delete(authMiddleware, authRouter, function(req, res) {
        Bookmark.findById(req.params.bookmarkId, function(err, bookmark) {
            if (err) res.status(500).send(err);
            else if (bookmark == null) res.status(404).send("Not found");
            else bookmark.verifyOwnership(req.user,
                    function(err, accessGranted) {
                if (err) res.status(500).send(err); // Should never enter
                else if (!accessGranted) res.status(401).send("Not authorized");
                else bookmark.remove(function(err, data) {
                    if (err) res.status(500).send(err);
                    else res.json(bookmark);
                });;
            });
        })
    });



/* GLOBAL ROUTES */
// -----------------------------------------------------------------------------
// API endpoints go under '/api' route. Other routes are redirected to
// index.html where AngularJS will handle frontend routes.
var routes = express.Router();
routes.use('/api', apiRoutes);
routes.get('*', function(req, res) {
    res.sendFile('index.html', {'root': 'public/dist'});
});

module.exports = routes;
