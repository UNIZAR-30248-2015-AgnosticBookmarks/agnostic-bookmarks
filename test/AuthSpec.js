// =============================================================================
//  This TODO
// =============================================================================

process.env.NODE_ENV = 'test';  // Set environment to testing
var request = require('request');
var baseURL = 'http://localhost:3000/';

describe("Auth API", function(){
    var server;
    beforeEach(function() {
        spyOn(console, "log");
        if (server == null) server = require('../index.js');
        else server.start();
    });
    afterEach(function() {
        server.close();  // After all server related tests, close the server
    });

    it("should return 401 when username doesn't match password", function() {
        var result = {};
        var timeout = 750;
        var done = false;
        runs(function() {
            request.post({url:baseURL + "api/auth", body:"{username: nouser, password:nopass}"},
                    function(error, response, body) {
                result.err = error;
                result.response = response;
                result.body = body;
                done = true;
            })
        });
        waitsFor(function() {
            return done;
        }, "getting server response", timeout);
        runs(function() {
            expect(result.err).toBe(null);
            expect(result.response.statusCode).toBe(401);
        });
    });
})
