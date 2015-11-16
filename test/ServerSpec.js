// =============================================================================
//  This file defines the tests for the web server using Jasmine BDD syntax
// -----------------------------------------------------------------------------
//  NOTE: There seems to be an error with Jasmine that crashes tests when an
//        exception is raised in a callback, so exceptions in callbacks must be
//        captured and then make the tests fail manually
//        (solved with jasmine-node and its runs/waitFor structure)
// -----------------------------------------------------------------------------
//  NOTE 2: In order for this test suites to pass, we need to have mongodb
//          running in background.
// =============================================================================

process.env.NODE_ENV = 'test';  // Set environment to testing
var request = require('request');
var baseURL = 'http://localhost:3000/';

// Since the first time this is imported it will launch the server, we make
// this variable global to ensure it is only imported once
var server;

describe("Web server", function() {

    // Before all server related tests...
    beforeEach(function() {
        // Replace console.log with a mock that won't do anything, so our
        // test will look clean and pretty
        spyOn(console, "log");
        // Start the server, either requiring its module or calling
        // server.start() if it had ben required before
        if (server == null) server = require('../index.js');
        server.start();
    });
    // After all server related tests, close the server
    afterEach(function() {
        server.close();
    });

    // GET petitions to the root of the webapp
    describe("GET /", function() {

        it("should return status code of 200", function(){
            var result = {};   // It will store the results of the async request
            var done = false;  // It will be true when the request is done
            var timeout = 750; // Timeout in millisecs for the request to be done

            // FIRST STEP: execute async request that will set the flag done
            // once its finished
            runs(function() {
                //Make request
                request.get(baseURL, function(error, response, body) {
                    // Manually store the result of the callback on a
                    // global test variable
                    result.err = error;
                    result.response = response;
                    result.body = body;
                    // Manually set the the flag done
                    done = true;
                })
            });

            // SECONDS STEP: run waitsFor, that will poll the function we are
            // passing until it returns true or a timeout is set
            waitsFor(function() {
                // This function will return true when the previous async task
                // sets the flag done to true
                return done;
            }, "getting server response", timeout);

            // LAST STEP: once waitsFor has got a true return on its callback
            // or its timeout has expired, this runs statement (which contains
            // the assertions) is run
            runs(function() {
                expect(result.err).toBe(null);
                expect(result.response.statusCode).toBe(200);
            });
        });
    });

});

describe("RESTful API", function() {

    beforeEach(function() {
        spyOn(console, "log");
        if (server == null) server = require('../index.js');
        else server.start();
    });
    afterEach(function() {
        server.close();  // After all server related tests, close the server
    });

    // GET petitions to the root of the webapp
    describe("GET /", function() {

        it("should return status code of 200", function(){
            var result = {};   // It will store the results of the async request
            var done = false;  // It will be true when the request is done
            var timeout = 750; // Timeout in millisecs for the request to be done

            runs(function() {
                request.get(baseURL + "api/", function(error, response, body) {
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
                expect(result.response.statusCode).toBe(200);
            });
        });
    });

});
