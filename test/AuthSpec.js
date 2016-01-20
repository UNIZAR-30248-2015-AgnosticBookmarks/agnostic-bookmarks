// =============================================================================
//  This file defines unit tests for the endpoint /api/auth. These
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
var server;
var config   = require('../app/config');
var Bookmark = require('../app/bookmark-model');
var User     = require('../app/user-model');
var baseURL  = 'http://localhost:' + process.env.PORT + '/api/auth';

describe("POST /api/auth", function(){

    var dummyUser = {};
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

        // Add a dummy user
        dummyUser = { username: 'dummy', password: 'dummy' };
        var userAdded = false;
        runs(function() {
            new User(dummyUser).save(function(err, data) {
                if (err) { console.log(err); userAdded = true; return; }
                dummyUser = data;
                userAdded = true;
            })
        });
        waitsFor(function() { return userAdded; }, "dummyUser creation", 1500);

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

    it("should return 200 when username and password match", function() {
        var result = {};
        var timeout = 1500;
        var done = false;
        runs(function() {
            request.get({
                url: baseURL,
                auth: { username: 'dummy', password:'dummy' }
            }, function(error, response, body) {
                result.err = error;
                result.response = response;
                result.body = body;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "getting server response", timeout);
        runs(function() {
            // expect(result.err).toBe(null);
            expect(result.response.statusCode).toBe(200);
        });
    });

    it("should return 401 when username doesn't match password", function() {
        var result = {};
        var timeout = 1500;
        var done = false;
        runs(function() {
            request.get({url:baseURL, body:"{username: nouser, password:nopass}"},
                    function(error, response, body) {
                result.err = error;
                result.response = response;
                result.body = body;
                done = true;
            })
        });
        waitsFor(function() { return done; }, "getting server response", timeout);
        runs(function() {
            expect(result.err).toBe(null);
            expect(result.response.statusCode).toBe(401);
        });
    });
});
