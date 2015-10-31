/**
 * Created by ramon on 31/10/2015.
 */
var express  = require('express');


var routes = express.Router();
routes.get('*', function(req, res) {
    res.sendFile(__dirname + '../public/index.html');
});

module.exports = routes;