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
        waitsFor(function() { return userAdded; }, "dummy user creation", 750);
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

    it('should not create a new bookmark if no authentication data is supplied', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.post({
                url: baseURL,
                json: true,
                body: {
                    url: "http://dummy.com",
                    name: "Dummy Bookmark",
                    description: "Dummy bookmark for testing purposes",
                    tags: ["testing", "dummy"]
                }
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
            expect(response.statusCode).toBe(401);
            expect(result).toBe('Unauthorized');
        });
    })

    it('should not create a new bookmark if incorrect authentication data is supplied', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.post({
                url: baseURL,
                auth: { username: "dummy", password: "badpasswd" },
                json: true,
                body: {
                    url: "http://dummy.com",
                    name: "Dummy Bookmark",
                    description: "Dummy bookmark for testing purposes",
                    tags: ["testing", "dummy"]
                }
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
            expect(response.statusCode).toBe(401);
            expect(result).toBe('Unauthorized');
        });
    })

    it('should create a new bookmark if correct data is supplied', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.post({
                url: baseURL,
                auth: { username: "dummy", password: "dummy" },
                json: true,
                body: {
                    url: "http://dummy.com",
                    name: "Dummy Bookmark",
                    description: "Dummy bookmark for testing purposes",
                    tags: ["testing", "dummy"]
                }
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
            expect(result).not.toBeNull();
            expect(result.name).toBe("Dummy Bookmark");
            expect(result.owner).toBe(dummyUser._id.toString());
            expect(result.url).toBe("http://dummy.com");
            expect(result.description).toBe("Dummy bookmark for testing purposes");
            expect(result.tags.length).toBe(2);
            expect(result.tags).toContain("testing");
            expect(result.tags).toContain("dummy");
            // Check data is in database
            Bookmark.findById(result._id, function(_error, _data) {
                error = _error;
                result = _data;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "database bookmark check", 750);
        runs(function() {
            // Check response
            expect(error).toBeNull();
            expect(result).not.toBeNull();
            expect(result.name).toBe("Dummy Bookmark");
            expect(result.owner).toEqual(dummyUser._id);
            expect(result.url).toBe("http://dummy.com");
            expect(result.description).toBe("Dummy bookmark for testing purposes");
            expect(result.tags.length).toBe(2);
            expect(result.tags).toContain("testing");
            expect(result.tags).toContain("dummy");
        });
    })

    it('should not create a new bookmark if incorrect url is supplied', function() {
        var done = false;
        var error, response, result;
        runs(function() {
            request.post({
                url: baseURL,
                auth: { username: "dummy", password: "dummy" },
                json: true,
                body: {
                    url: "http:dummy.com",
                    name: "Dummy Bookmark",
                    description: "Dummy bookmark for testing purposes",
                    tags: ["testing", "dummy"]
                }
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
            expect(response.statusCode).toBe(400);
            expect(result.error).toBe('invalid URL');
        });
    })

    it('should not create a new bookmark if url is already in use', function() {
        var done = false;
        var originalBookmark, retrievedBookmark;
        var error, response, result;
        runs(function() {
            new Bookmark({
                url: "http://dummy.com",
                name: "Dummy Bookmark 1",
                owner: dummyUser._id,
                description: "Dummy bookmark 1 description",
                tags: ["testing1", "dummy1"]
            }).save(function(error, data) {
                done = true;
                originalBookmark = data;
            })
        })
        waitsFor(function() { return done; }, "first bookmark creation", 750);
        runs(function() {
            done = false;
            request.post({
                url: baseURL,
                auth: { username: "dummy", password: "dummy" },
                json: true,
                body: {
                    url: originalBookmark.url,
                    name: "Dummy Bookmark 2",
                    description: "Dummy bookmark 2 description",
                    tags: ["testing2", "dummy2", "invalid"]
                }
            }, function(_error, _response, _body) {
                error = _error;
                response = _response;
                result = _body;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "second bookmark creation", 750);
        runs(function() {
            done = false;
            // Check response
            expect(response.statusCode).toBe(400);
            expect(result.error).toBe("URL is already in use");
            // Check data is in database
            Bookmark.findOne({owner: dummyUser._id, url: originalBookmark.url },
                function(_error, _data) {
                    error = _error;
                    retrievedBookmark = _data;
                    done = true;
                });
        });
        waitsFor(function() { return done; }, "database bookmark check", 750);
        runs(function() {
            // Check response
            expect(error).toBeNull();
            expect(retrievedBookmark._id).toEqual(originalBookmark._id);
            expect(retrievedBookmark.name).toBe(originalBookmark.name);
            expect(retrievedBookmark.description).toBe(originalBookmark.description);
            expect(retrievedBookmark.tags).toEqual(originalBookmark.tags);
        });
    })
});
