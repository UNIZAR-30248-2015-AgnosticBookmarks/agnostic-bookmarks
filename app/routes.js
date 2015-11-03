//THIS CHANGE MUST BE DISCARDED!
var express  = require('express');


var routes = express.Router();
routes.get('*', function(req, res) {
    res.sendFile(__dirname + '../public/index.html');
});

module.exports = routes;
