var module = angular.module('AgnosticBookmarks');
module.service('UserService', function($http, $location) {
    return {
        authenticate: authenticate,
        register: register
    }

    function authenticate(user, pass, callback) {
        var credentials = {username: user, password: pass};
        $http.post(
            "http://192.168.1.4:3000/api/auth/",
            JSON.stringify(credentials),
            {headers: {'Content-Type': 'application/json'}}
        ).then(function onSuccess(response) {
            callback(true);
        }, function onError(response) {
            callback(false);
        });
    }

    function register(user, pass, callback) {
        
    }
});
