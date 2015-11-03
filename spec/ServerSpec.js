// =============================================================================
//  This file defines the tests for the web server using Jasmine BDD syntax
// -----------------------------------------------------------------------------
//  NOTE: There seems to be an error with Jasmine that crashes tests when an
//        exception is raised in a callback, so exceptions in callbacks must be
//        captured and then make the tests fail manually
// =============================================================================

var request = require('request');
var baseURL = 'http://localhost:3000/';

xdescribe("Web server", function() {

    // GET petitions to the root of the webapp
    describe("GET /", function() {
        it("returns status code 200", function(done){
            request.get(baseURL, function(error, response, body){
                try {
                    expect(response.statusCode).toBe(200);  // Assertion
                    done();  // Mandatory for async tests
                } catch (exception) {
                    // Make test fail manually if an exception is thrown
                    done.fail("Exception inside callback: \""+exception+"\"");
                }
            });
        });
    });
});

descreibe("Demo test", function() {
  it("should always pass", function() {
    expect(true).toBe(true);
  });
});
