var module = angular.module('AgnosticBookmarks');
module.service('UserService', function ($http, $location) {
    return {
        authenticate: authenticate,
        register: register,
        getList: getList
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
        //callback(true);
        var credentials = {username: user, password: pass};
        $http.post(
            "http://192.168.1.4:3000/api/users/",
            JSON.stringify(credentials),
            {headers: {'Content-Type': 'application/json'}}
        ).then(function onSuccess(response) {
                callback(true);
            }, function onError(response) {
                callback(false);
            });
    }

    function getList(user, callback) {
        var credentials = {username: user};
        var bookmarkList = [{}];
        $http.get(
            "http://192.168.1.4:3000/api/userBookmarks/",
            JSON.stringify(credentials),
            {headers: {'Content-Type': 'application/json'}}
        ).then(function onSuccess(response) {
               bookmarkList = response.dataFind;
                callback(bookmarkList);
            }, function onError(response) {
                //TODO is here cause api not working
                bookmarkList = [
                    {
                        "name" : "Google",
                        "username" : "alberto",
                        "link" : "http://www.google.es",
                        "labels" : [
                            {

                            }
                        ],
                        "description" : "My Google stuff"
                    },
                    {
                        "name" : "Github",
                        "username" : "alberto",
                        "link" : "http://github.com/albertorevel",
                        "labels" : [
                            {
                                "L1" : "git",
                                "L2" : "programming"
                            }
                        ],
                        "description" : "My online reps"
                    },
                    {
                        "name" : "Other ",
                        "username" : "alberto",
                        "link" : "https://www.other.com",
                        "labels" : [
                            {

                            }
                        ],
                        "description" : "Other"
                    }
                ]
                callback(bookmarkList);
            });

    }


});
