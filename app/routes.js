/**
 * Created by ramon on 31/10/2015.
 */
var express  = require('express');
var User     = require('./user-model');

/* API ROUTES */
var apiRoutes = express.Router();

apiRoutes.get("/", function(req, res) {
    res.json("Welcom to the coolest API on earth");
});

apiRoutes.route("/users")
    .get(function(req, res){
        User.find({}, function(err, users){
            res.send.json(users);
        });
    })
    .post(function(req, res){
        new User({
            username: req.body.username,
            password: req.body.password
        }).save(function(err, data){
            if (err) res.status(500).send(err);
            else res.json(data);
        });
    });

var routes = express.Router();
routes.use("/api", apiRoutes);
routes.get('*', function(req, res) {
    res.sendFile(__dirname + '../public/index.html');
});

module.exports = routes;