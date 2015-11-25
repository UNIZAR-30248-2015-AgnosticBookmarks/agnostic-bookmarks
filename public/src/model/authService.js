var module = angular.module('AgnosticBookmarks');
module.service('UserService', function ($http, $location) {
    return {
        authenticate: authenticate,
        register: register,
        newBookmark: newBookmark
    }

    function authenticate(user, pass, callback) {
        var credentials = {username: user, password: pass};
        $http.post(
            "http://localhost:3000/api/auth/",
            JSON.stringify(credentials),
            {headers: {'Content-Type': 'application/json'}}
        ).then(function onSuccess(response) {
                callback(true);
            }, function onError(response) {
                callback(false);
            });
    }

    // ESTO FUNCIONA
    function register(user, pass, callback) {
        //callback(true);
        var credentials = {username: user, password: pass, success: false};
        $http.post(
            "http://localhost:3000/api/users/",
            JSON.stringify(credentials),
            {headers: {'Content-Type': 'application/json'}}
        ).then(function onSuccess(response) {
                callback(true);
            }, function onError(response) {
                callback(false);
            });
    }


});
