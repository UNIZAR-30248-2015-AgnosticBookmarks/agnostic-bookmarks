// =============================================================================
//  This file defines unit tests for the bookmarks mongoose model. This tests
//  connect to an actual database, so be sure to specify a testing database if
//  you are running them on an environment with important data.
// -----------------------------------------------------------------------------
//  NOTE: Before running your tests, ensure your testing database is empty,
//        otherwise tests can fail and even hung.
// =============================================================================

process.env.NODE_ENV = 'test';  // Set environment to testing

var mongoose = require('mongoose');
var config   = require('../app/config');
var Bookmark = require('../app/bookmark-model');
var User     = require('../app/user-model');

describe("Bookmark model", function() {

    var dummyUser, dummyBookmark;

    beforeEach(function() {
        var connected = false;
        var userAdded = false;

        // Connect to the database
        runs(function() {
            mongoose.connect(config.database, function(err) {
                if (err) throw err;
                connected = true;
            });
        });
        waitsFor(function() {
            return connected;
        }, "mongoose connection", 5000);

        // Add a dummy user
        runs(function() {
            new User({
                username: 'dummy',
                password: 'dummy'
            }).save(function(err, data) {
                if (err) { console.log(err); done = true; return; }
                dummyUser = data;
                userAdded = true;
            })
        });
        waitsFor(function() { return userAdded; }, "dummy user creation", 1500);
    });

    afterEach(function() {
        var cleaned = false;
        var disconnected = false;

        // Clean database
        runs(function() {
            mongoose.connection.db.dropDatabase(function() { cleaned = true; });
        })
        waitsFor(function() { return cleaned; }, "mongoose data cleaning", 1000);

        // Close connection
        runs(function() {
            mongoose.connection.close(function() { disconnected = true; });
        })
        waitsFor(function() { return disconnected }, "mongoose connection close", 1000);
    })

    it('should create a new bookmark if correct data is supplied', function() {
        var done = false;
        var err  = null;
        var data = null;
        runs(function() {
            new Bookmark({
                name: "dummyBookmark",
                owner: dummyUser._id,
                url: "http://www.dummy.com",
                description: "Just a dummy bookmark for testing purposes"
            }).save(function (_err, _data) {
                if (_err) { console.log(_err); done = true; return; }
                err = _err;
                data = _data;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "bookmark creation", 1500);
        runs(function() {
            expect(err).toBeNull();
            expect(data).not.toBeNull();
            expect(data.name).toBe("dummyBookmark");
            expect(data.owner).toBe(dummyUser._id);
            expect(data.url).toBe("http://www.dummy.com");
            expect(data.description).toBe("Just a dummy bookmark for testing purposes");
        })
    })

    it('should throw an error if trying to add two bookmarks with the same URL to the same user', function() {
        var firstBookmark = false;
        var secondBookmark = false;
        var done = false;
        var err  = null;
        var data = null;
        var count = 0;
        // Create first bookmark
        runs(function() {
            new Bookmark({
                name: "dummyBookmark",
                owner: dummyUser._id,
                url: "http://www.dummy.com",
                description: "Just a dummy bookmark for testing purposes"
            }).save(function (_err, _data) {
                if (_err) { console.log(_err); return; }
                err = _err;
                dummyBookmark = _data;
                firstBookmark = true;
            });
        });
        waitsFor(function() { return firstBookmark; }, "first bookmark creation", 1500);
        // Create second bookmark (should return error)
        runs(function() {
            new Bookmark({
                name: "dummyBookmark",
                owner: dummyUser._id,
                url: dummyBookmark.url,
                description: "Just a dummy bookmark for testing purposes"
            }).save(function (_err, _data) {
                err = _err;
                data = _data;
                secondBookmark = true;
            });
        });
        waitsFor(function() { return secondBookmark; }, "second bookmark creation", 1500);
        // Count bookmarks (should return 1)
        runs(function() {
            Bookmark.count({ owner: dummyUser._id, url: 'http://www.dummy.com' },
                    function(_err, _count) {
                if (_err) throw _err;
                count = _count;
                done = true;
            });
        });
        waitsFor(function() { return done; }, "bookmark count", 1500);
        // Assert
        runs(function() {
            expect(err).not.toBeNull();
            expect(data).not.toBeDefined();
            expect(count).toBe(1);
        })
    })
});
