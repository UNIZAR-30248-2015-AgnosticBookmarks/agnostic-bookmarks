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
            //192.168.1.4
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

    function newBookmark(id, title, link, callback){
        var credentials = {id: id, title: user, link: pass, tags:""};
        $http.post(
            "http://localhost:3000/api/createBookmark/",
            JSON.stringify(credentials),
            {headers: {'Content-Type': 'application/json'}}
        ).then(function onSuccess(response) {
                callback(true);
            }, function onError(response) {
                callback(false);
            });
        callback(true);

    }



});
