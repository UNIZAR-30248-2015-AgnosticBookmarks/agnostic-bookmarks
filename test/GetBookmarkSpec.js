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
var server;
var config   = require('../app/config');
var Bookmark = require('../app/bookmark-model');
var User     = require('../app/user-model');
var baseURL  = 'http://localhost:' + process.env.PORT + '/api/bookmarks';

describe("GET /api/bookmarks", function() {

    var dummyUser1 = {};
    var dummyUser2 = {};
    var mostRecentBookmark = {};
    var secondMostRecentBookmark = {};
    var firstNameBookmark = {};
    var secondNameBookmark = {};

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
        dummyUser1 = { username: 'dummy1', password: 'dummy1' };
        var userAdded1 = false;
        runs(function() {
            new User(dummyUser1).save(function(err, data) {
                if (err) { console.log(err); userAdded1 = true; return; }
                dummyUser1 = data;
                userAdded1 = true;
            })
        });
        waitsFor(function() { return userAdded1; }, "dummyUser1 creation", 750);

        // Add another dummy user
        dummyUser2 = { username: 'dummy2', password: 'dummy2' };
        var userAdded2 = false;
        runs(function() {
            new User(dummyUser2).save(function(err, data) {
                if (err) { console.log(err); userAdded2 = true; return; }
                dummyUser2 = data;
                userAdded2 = true;
            })
        });
        waitsFor(function() { return userAdded2; }, "dummyUser2 creation", 750);

        // Add 15 bokomarks to dummyUser1
        var left = 0;
        var max = 15;
        runs(function addBookmark1() {
            new Bookmark({
                url: "http://dummy" + left + ".com",
                name: "Dummy Bookmark " + left,
                owner: dummyUser1._id,
            }).save(function(error, data) {
                if (error) console.log(error);
                if (left == 0) firstNameBookmark = data;
                else if (left == 1) secondNameBookmark = data;
                else if (left == max - 2) secondMostRecentBookmark = data;
                else if (left == max - 1) mostRecentBookmark = data;
                left++;
                if (left < max) addBookmark1();
            })
        })
        waitsFor(function() { return left >= max; }, "User1's bookmarks creation", 2000);

        // Add 15 bokomarks to dummyUser2
        left = 0;
        max = 15;
        runs(function addBookmark2() {
            new Bookmark({
                url: "http://dummy" + left + ".com",
                name: "Dummy Bookmark " + left,
                owner: dummyUser2._id,
            }).save(function(error, data) {
                if (error) console.log(error);
                left++;
                if (left < max) addBookmark2();
            })
        })
        waitsFor(function() { return left >= max; }, "User1's bookmarks creation", 2000);


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

    it('should get the most recent bookmark from user1', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.get({
                url: baseURL,
                qs: { sortBy: 'date', pageSize: '1', offset: '0' },
                auth: { username: "dummy1", password: "dummy1" },
                json: true,
            }, function(_error, _response, _body) {
                error = _error;
                response = _response;
                result = _body;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "bookmark creation", 750);
        runs(function() {
            done = false;
            // Check response
            expect(response.statusCode).toBe(200);
            expect(result.length).toBe(1);
            expect(result[0]._id).toEqual(mostRecentBookmark._id.toString());
            expect(result[0].owner).toBe(dummyUser1._id.toString());
            expect(result[0].name).toBe(mostRecentBookmark.name);
            expect(result[0].description).not.toBeDefined();
            expect(result[0].tags.length).toBe(0);
        });
    })

    it('should get the second most recent bookmark from user1', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.get({
                url: baseURL,
                qs: { sortBy: 'date', pageSize: '1', offset: '1' },
                auth: { username: "dummy1", password: "dummy1" },
                json: true,
            }, function(_error, _response, _body) {
                error = _error;
                response = _response;
                result = _body;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "bookmark creation", 750);
        runs(function() {
            done = false;
            // Check response
            expect(response.statusCode).toBe(200);
            expect(result.length).toBe(1);
            expect(result[0]._id).toEqual(secondMostRecentBookmark._id.toString());
            expect(result[0].owner).toBe(dummyUser1._id.toString());
            expect(result[0].name).toBe(secondMostRecentBookmark.name);
            expect(result[0].description).not.toBeDefined();
            expect(result[0].tags.length).toBe(0);
        });
    })

    it('should get the first named bookmark from user1', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.get({
                url: baseURL,
                qs: { sortBy: 'name', pageSize: '1', offset: '0' },
                auth: { username: "dummy1", password: "dummy1" },
                json: true,
            }, function(_error, _response, _body) {
                error = _error;
                response = _response;
                result = _body;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "bookmark creation", 750);
        runs(function() {
            done = false;
            // Check response
            expect(response.statusCode).toBe(200);
            expect(result.length).toBe(1);
            expect(result[0]._id).toEqual(firstNameBookmark._id.toString());
            expect(result[0].owner).toBe(dummyUser1._id.toString());
            expect(result[0].name).toBe(firstNameBookmark.name);
            expect(result[0].description).not.toBeDefined();
            expect(result[0].tags.length).toBe(0);
        });
    })

    it('should get the second named bookmark from user1', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.get({
                url: baseURL,
                qs: { sortBy: 'name', pageSize: '1', offset: '1' },
                auth: { username: "dummy1", password: "dummy1" },
                json: true,
            }, function(_error, _response, _body) {
                error = _error;
                response = _response;
                result = _body;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "bookmark creation", 750);
        runs(function() {
            done = false;
            // Check response
            expect(response.statusCode).toBe(200);
            expect(result.length).toBe(1);
            expect(result[0]._id).toEqual(secondNameBookmark._id.toString());
            expect(result[0].owner).toBe(dummyUser1._id.toString());
            expect(result[0].name).toBe(secondNameBookmark.name);
            expect(result[0].description).not.toBeDefined();
            expect(result[0].tags.length).toBe(0);
        });
    })
});
