// =============================================================================
//  This file defines unit tests for the endpoint /api/bookmarks/search. These
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
var baseURL  = 'http://localhost:' + process.env.PORT + '/api/bookmarks/search';

describe("GET /api/bookmarks/search", function() {

    var dummyUser1 = {};
    var dummyUser2 = {};
    var aaaBookmark = {};
    var bbbBookmark = {};
    var xxxBookmark = {};
    var aaa2Bookmark = {};

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
        waitsFor(function() { return userAdded1; }, "dummyUser1 creation", 1500);

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
        waitsFor(function() { return userAdded2; }, "dummyUser2 creation", 1500);

        // Add some bokomarks
        var done = false;
        runs(function addBookmark1() {
            new Bookmark({
                url: "http://dummyAAA.com",
                name: "AAA",
                owner: dummyUser1._id,
                tags: ["tag1", "tag2"]
            }).save(function(error, data) {
                if (error) console.log(error);
                aaaBookmark = data;
                done = true;
            })
        })
        waitsFor(function() { return done; }, "User1's bookmarks creation", 2000);

        done = false;
        runs(function addBookmark1() {
            new Bookmark({
                url: "http://dummyBBB.com",
                name: "BBB",
                owner: dummyUser1._id,
                description: "AAA",
            }).save(function(error, data) {
                if (error) console.log(error);
                bbbBookmark = data;
                done = true;
            })
        })
        waitsFor(function() { return done; }, "User1's bookmarks creation", 2000);

        done = false;
        runs(function addBookmark1() {
            new Bookmark({
                url: "http://dummyXXX.com",
                name: "XXX",
                owner: dummyUser1._id,
                description: "XXX",
                tags: ["tag1", "tag3"]
            }).save(function(error, data) {
                if (error) console.log(error);
                xxxBookmark = data;
                done = true;
           })
        })
        waitsFor(function() { return done; }, "User1's bookmarks creation", 2000);

        done = false;
        runs(function addBookmark1() {
            new Bookmark({
                url: "http://dummyAAA.com",
                name: "AAA",
                owner: dummyUser2._id,
                tags: ["tag1", "tag2"]
            }).save(function(error, data) {
                if (error) console.log(error);
                aaa2Bookmark = data;
                done = true;
            })
        })
        waitsFor(function() { return done; }, "User1's bookmarks creation", 2000);
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

    it('should get bookmarks "AAA" and "BBB"', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.get({
                url: baseURL,
                qs: { search: 'AA', sortBy: 'name' },
                auth: { username: "dummy1", password: "dummy1" },
                json: true,
            }, function(_error, _response, _body) {
                error = _error;
                response = _response;
                result = _body;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "bookmark creation", 1500);
        runs(function() {
            done = false;
            // Check response
            expect(response.statusCode).toBe(200);
            expect(result.length).toBe(2);
            expect(result[0]._id).toEqual(aaaBookmark._id.toString());
            expect(result[0].owner).toBe(dummyUser1._id.toString());
            expect(result[0].name).toBe(aaaBookmark.name);
            expect(result[0].description).not.toBeDefined();
            expect(result[0].tags.length).toBe(2);
            expect(result[0].tags).toContain("tag1");
            expect(result[0].tags).toContain("tag2");
            expect(result[1]._id).toEqual(bbbBookmark._id.toString());
            expect(result[1].owner).toBe(dummyUser1._id.toString());
            expect(result[1].name).toBe(bbbBookmark.name);
            expect(result[1].description).toBe(bbbBookmark.description)
            expect(result[1].tags.length).toBe(0);
        });
    })

    it('should get bookmarks "AAA" and "XXX"', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.get({
                url: baseURL,
                qs: { tag: 'tag1', sortBy: 'name' },
                auth: { username: "dummy1", password: "dummy1" },
                json: true,
            }, function(_error, _response, _body) {
                error = _error;
                response = _response;
                result = _body;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "bookmark creation", 1500);
        runs(function() {
            done = false;
            // Check response
            expect(response.statusCode).toBe(200);
            expect(result.length).toBe(2);
            expect(result[0]._id).toEqual(aaaBookmark._id.toString());
            expect(result[0].owner).toBe(dummyUser1._id.toString());
            expect(result[0].name).toBe(aaaBookmark.name);
            expect(result[0].description).not.toBeDefined();
            expect(result[0].tags.length).toBe(2);
            expect(result[0].tags).toContain("tag1");
            expect(result[0].tags).toContain("tag2");
            expect(result[1]._id).toEqual(xxxBookmark._id.toString());
            expect(result[1].owner).toBe(dummyUser1._id.toString());
            expect(result[1].name).toBe(xxxBookmark.name);
            expect(result[1].description).toBe(xxxBookmark.description)
            expect(result[1].tags.length).toBe(2);
            expect(result[1].tags).toContain("tag1");
            expect(result[1].tags).toContain("tag3");
        });
    })

    it('should only get bookmark "AAA"', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.get({
                url: baseURL,
                qs: { tag: 'tag1,tag2', sortBy: 'name' },
                auth: { username: "dummy1", password: "dummy1" },
                json: true,
            }, function(_error, _response, _body) {
                error = _error;
                response = _response;
                result = _body;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "bookmark creation", 1500);
        runs(function() {
            done = false;
            // Check response
            expect(response.statusCode).toBe(200);
            expect(result.length).toBe(1);
            expect(result[0]._id).toEqual(aaaBookmark._id.toString());
            expect(result[0].owner).toBe(dummyUser1._id.toString());
            expect(result[0].name).toBe(aaaBookmark.name);
            expect(result[0].description).not.toBeDefined();
            expect(result[0].tags.length).toBe(2);
            expect(result[0].tags).toContain("tag1");
            expect(result[0].tags).toContain("tag2");
        });
    })

    it('should return error if no searh or tag fields are provided', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.get({
                url: baseURL,
                qs: { sortBy: 'name' },
                auth: { username: "dummy1", password: "dummy1" },
                json: true,
            }, function(_error, _response, _body) {
                error = _error;
                response = _response;
                result = _body;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "bookmark creation", 1500);
        runs(function() {
            done = false;
            // Check response
            expect(response.statusCode).toBe(400);
            expect(result.errors[0]).toEqual({required: "'search' or 'tag' field are required"});
        });
    })

    it('should return error if no auth info is provided', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.get({
                url: baseURL,
                qs: { search: "aaa", sortBy: 'name' },
                json: true,
            }, function(_error, _response, _body) {
                error = _error;
                response = _response;
                result = _body;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "bookmark creation", 1500);
        runs(function() {
            done = false;
            // Check response
            expect(response.statusCode).toBe(401);
        });
    })
});
