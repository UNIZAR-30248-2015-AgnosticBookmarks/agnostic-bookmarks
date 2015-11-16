// =============================================================================
//  This TODO
// =============================================================================

process.env.NODE_ENV = 'test';  // Set environment to testing
var request = require('request');
var baseURL = 'http://localhost:3000/';
var BookMarks = require('../app/bookmark-model');

describe("Bookmarks API", function(){
    var server;
    // Before all server related tests...
    beforeEach(function() {
        // Replace console.log with a mock that won't do anything, so our
        // test will look clean and pretty
        spyOn(console, "log");
        // Start the server
        if (server == null) server = require('../index.js');
        try {
            server.start();
        } catch(err) {
            if (err.message != "Trying to open unclosed connection.") throw err
        }
    });
    // After all server related tests, close the server
    afterEach(function() {
        server.close();
    });


    it("should return 400 when adding a new bookmark and name already exist for this user", function() {
        var result = {};
        var timeout = 750;
        var done = false;
        runs(function() {
            request({
                headers: {
                    'username': 'test',
                    'password': 'pwd'
                },
                uri: baseURL + "api/addBookmark",
                body: "{name: name1, link: link1}",
                method: 'POST'
            }, function (err, res, body) {
                result.err = error;
                result.response = response;
                result.body = body;
                done = true;
            });
        });
        waitsFor(function() {
            return done;
        }, "getting server response", timeout);
        runs(function() {
            expect(result.err).toBe(null);
            expect(result.response.statusCode).toBe(400);

        });
    });

    it("should return 200 when deleting an existing bookmark for this user", function() {
        var result = {};
        var timeout = 750;
        var done = false;
        runs(function() {
            new BookMarks({
                name: 'delete',
                username: 'test',
                link: 'nomatter'
            }).save(function(err, data){
                    if (err) res.status(500).send(err);
                    else res.json(data);
                });

            request({
                headers: {
                    'username': 'test',
                    'password': 'pwd'
                },
                uri: baseURL + "api/deleteBookmark",
                body: "{name: delete}",
                method: 'POST'
            }, function (err, res, body) {
                result.err = error;
                result.response = response;
                result.body = body;
                done = true;
            });
        });
        waitsFor(function() {
            return done;
        }, "getting server response", timeout);
        runs(function() {
           // expect(result.err).toBe(null);
            expect(res.statusCode).toBe(200);

        });
    });



})
