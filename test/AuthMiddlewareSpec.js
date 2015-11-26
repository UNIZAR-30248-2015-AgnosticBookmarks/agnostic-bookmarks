// =============================================================================
//  This file defines unit tests for authentication middleware. This tests DO
//  NOT connect to the database, they use mocks instead.
// =============================================================================

process.env.NODE_ENV = 'test';  // Set environment to testing
var middleware = require('../app/auth-middleware');

describe("Auth middleware", function() {

    describe("basic middleware", function() {
        var req, res;
        var mockUser;
        var verifyPasswordMock;
        var mockValues = {
            goodName: "dummy",
            errorName: "error",  // Used to force error in query
            goodPass: "secret",
            goodPass: "wrong",
            errorPass: "error",  // Used to force error in query
            errorMsg: "Error happened!",
            dummyId: "123dummy"
        };


        beforeEach(function() {
            req = { headers: {}, params: {} };
            res = {};
            //Create mock for User.verifyPassword
            verifyPasswordMock = jasmine.createSpy('verifyPassword')
                    .andCallFake(function(pass, callback) {
                if (pass === mockValues.errorPass) callback(mockValues.errorMsg);
                else if (pass === mockValues.goodPass) callback(null, true);
                else callback(null, false);
            })
            // Create a mock user
            mockUser = {
                _id: mockValues.dummyId,
                username: mockValues.goodName,
                verifyPassword: verifyPasswordMock
            }
            //Create mock for User.findOne
            spyOn(User, "findOne").andCallFake(function(query, callback) {
                if (query.username === mockValues.errorName) {
                    callback(mockValues.errorMsg);
                }
                else if (query.username === mockValues.goodName) {
                    callback(null, mockUser);
                } else {
                    callback(null, null);
                }
            });
        });

        it("should add internalError to request when user query generates error", function() {
            req.headers.username = mockValues.errorName;
            var done = false;
            var timeout = 5000;
            runs(function() {
                middleware.basicMiddleware(req, res, function(){
                    done = true;
                })
            })
            waitsFor(function() { return done; }, "database response", timeout);
            runs(function() {
                expect(req.params.user).not.toBeDefined();
                expect(req.params.internalError).toBe(mockValues.errorMsg);
            });
        });

        it("should add null user to request when no user is provided", function() {
            var done = false;
            var timeout = 5000;
            runs(function() {
                middleware.basicMiddleware(req, res, function(){
                    done = true;
                })
            })
            waitsFor(function() { return done; }, "database response", timeout);
            runs(function() {
                expect(req.params.internalError).not.toBeDefined();
                expect(req.params.user).toBeDefined();
                expect(req.params.user).toBeNull();
            });
        });

        it("should add internalError to request when password query generates error", function() {
            req.headers.username = mockValues.goodName;
            req.headers.password = mockValues.errorPass;
            var done = false;
            var timeout = 5000;
            runs(function() {
                middleware.basicMiddleware(req, res, function(){
                    done = true;
                })
            })
            waitsFor(function() { return done; }, "database response", timeout);
            runs(function() {
                expect(verifyPasswordMock).toHaveBeenCalled();
                expect(req.params.user).not.toBeDefined();
                expect(req.params.internalError).toBe(mockValues.errorMsg);
            });
        });

        it("should add null user to request when password doesn't match username", function() {
            req.headers.username = mockValues.goodName;
            req.headers.password = mockValues.wrongPass;
            var done = false;
            var timeout = 5000;
            runs(function() {
                middleware.basicMiddleware(req, res, function(){
                    done = true;
                })
            })
            waitsFor(function() { return done; }, "database response", timeout);
            runs(function() {
                expect(verifyPasswordMock).toHaveBeenCalled();
                expect(req.params.internalError).not.toBeDefined();
                expect(req.params.user).toBeDefined();
                expect(req.params.user).toBeNull();
            });
        });

        it("should add user data to request when password matches username", function() {
            req.headers.username = mockValues.goodName;
            req.headers.password = mockValues.goodPass;
            var done = false;
            var timeout = 5000;
            runs(function() {
                middleware.basicMiddleware(req, res, function(){
                    done = true;
                })
            })
            waitsFor(function() { return done; }, "database response", timeout);
            runs(function() {
                expect(verifyPasswordMock).toHaveBeenCalled();
                expect(req.params.internalError).not.toBeDefined();
                //expect(req.params.user).not.toBeDefined();
                expect(req.params.user).toBe(mockValues.dummyId);
            });
        });
    });
});
