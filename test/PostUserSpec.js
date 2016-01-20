// =============================================================================
//  This file defines unit tests for the endpoint /api/bookmarks. These
//  tests connect to an actual database, so be sure to specify a testing
//  database if you are running them on an environment with important data.
// -----------------------------------------------------------------------------
//  NOTE: Before running your tests, ensure your testing database is empty,
//        otherwise tests can fail and even hung.
// =============================================================================
process.env.NODE_ENV = 'test';  // Set environment to testing
process.env.PORT = 3000;        // Set port to 3000

var mongoose = require('mongoose');
var request  = require('request');
var bcrypt   = require('bcrypt-nodejs');
var server;
var config   = require('../app/config');
var User     = require('../app/user-model');
var baseURL  = 'http://localhost:' + process.env.PORT + '/api/users';

describe("POST /api/bookmarks", function() {

    var dummyUser = {};
    var dummyBookmark = {};

    beforeEach(function() {
        // Launch server
        var connected = false;
        runs(function() {
            // Replace console.log with a mock that won't do anything, so our
            // test will look clean and pretty
            spyOn(console, "log");
            // Start the server
            if (server == null) server = require('../index.js');
            try {
                server.start(function() { connected = true; });
            } catch(err) {
                if (err.message != "Trying to open unclosed connection.") throw err
                else connected = true;
            }
        })
        waitsFor(function() { return connected }, "server start", 1000);

        // // Add a dummy user
        // dummyUser = { username: 'dummy', password: 'dummy' };
        // var userAdded = false;
        // runs(function() {
            // new User(dummyUser).save(function(err, data) {
                // if (err) { console.log(err); userAdded = true; return; }
                // dummyUser = data;
                // userAdded = true;
            // })
        // });
        // waitsFor(function() { return userAdded; }, "dummy user creation", 1500);
    });

    afterEach(function() {
        var done = false;
        var timeout = 1000;
        // Clean database
        var cleaned = false;
        runs(function() {
            mongoose.connection.db.dropDatabase(function() { cleaned = true; });
        })
        waitsFor(function() { return cleaned; }, "mongoose data cleaning", 1000);
        // Close server
        runs(function() {
            server.close(function() {
                done = true;
            });
        })
        waitsFor(function() {
            return done;
        }, "closing server", timeout);
    })

    it('should create a new user if correct data is supplied', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.post({
                url: baseURL,
                json: true,
                body: {
                    username: "dummy",
                    password: "dummy"
                }
            }, function(_error, _response, _body) {
                error = _error;
                response = _response;
                result = _body;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "user creation", 750);
        runs(function() {
            done = false;
            // Check response
            expect(response.statusCode).toBe(200);
            expect(result.username).toBe("dummy");
            expect(result._id).toBeDefined();
            expect(result.password).not.toBeDefined();
            // Check user is in database
            User.findById(result._id, function(_error, _data) {
                error = _error;
                result = _data;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "database user check", 750);
        var passMatch = false;
        runs(function() {
            // Check response
            done = false;
            expect(result.username).toBe("dummy");
            bcrypt.compare("dummy", result.password, function (err, matchSuccess) {
                if (err) throw err;
                else {
                    passMatch = matchSuccess;
                    done = true;
                }
            });
        });
        waitsFor(function() { return done; }, "check database info", 750);
        runs(function() {
            // Check response
            done = false;
            expect(passMatch).toBeTruthy();
        });
    })

    it('should not create a new user if username is not provided', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.post({
                url: baseURL,
                json: true,
                body: {
                    // username: "dummy",
                    password: "dummy"
                }
            }, function(_error, _response, _body) {
                error = _error;
                response = _response;
                result = _body;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "user creation", 750);
        runs(function() {
            done = false;
            // Check response
            expect(response.statusCode).toBe(400);
        });
    })

    it('should not create a new user if password is not provided', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.post({
                url: baseURL,
                json: true,
                body: {
                    username: "dummy",
                    // password: "dummy"
                }
            }, function(_error, _response, _body) {
                error = _error;
                response = _response;
                result = _body;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "user creation", 750);
        runs(function() {
            done = false;
            // Check response
            expect(response.statusCode).toBe(400);
        });
    })

    xit('should not create a new user if username is already in use', function() {
        var done = false;
        var originalUser, retrievedUser;
        var error, response, result;
        runs(function() {
            new User({
                username: "dummy",
                password: "dummy1"
            }).save(function(error, data) {
                done = true;
                originalUser = data;
                console.log(originalUser);
            })
        });
        waitsFor(function() { return done; }, "first user creation", 750);
        runs(function() {
            done = false;
            request.post({
                url: baseURL,
                json: true,
                body: {
                    username: "dummy",
                    password: "dummy2"
                }
            }, function(_error, _response, _body) {
                error = _error;
                response = _response;
                result = _body;
                console.log(result);
                done = true;
            });
        });
        waitsFor(function() { return done; }, "second user creation", 750);
        runs(function() {
            done = false;
            // Check response
            expect(response.statusCode).toBe(400);
            // Check data is in database
            User.findOne({username: "dummy" },
                function(_error, _data) {
                    error = _error;
                    retrievedUser = _data;
                    console.log(retrievedUser);
                    done = true;
                });
        });
        waitsFor(function() { return done; }, "database bookmark check", 750);
        runs(function() {
            // Check response
            console.log(originalUser);
            expect(retrievedUser._id).toEqual(originalUser._id);
            expect(retrievedUser.username).toBe(originalUser.name);
        });
    })
});
