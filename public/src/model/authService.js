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
        //var credentials = {username: user};
        //$http.get(
        //    "http://192.168.1.4:3000/api/userBookmarks/",
        //    JSON.stringify(credentials),
        //    {headers: {'Content-Type': 'application/json'}}
        //).then(function onSuccess(response) {
        //        //$scope.bookmarkList = response.dataFind;
        //        $scope.bookmarkList = [
        //            {
        //                "name" : "Google ES",
        //                "link" : "http://www.google.es"
        //            },
        //            {
        //                "name" : "Google COM",
        //                "link" : "http://www.google.com"
        //            }
        //        ]
        //        callback(true);
        //    }, function onError(response) {
        //        //$scope.bookmarkList =null;
        //        $scope.bookmarkList = [
        //            {
        //                "name" : "Google DE",
        //                "link" : "http://www.google.de"
        //            },
        //            {
        //                "name" : "Google FR",
        //                "link" : "http://www.google.fr"
        //            }
        //        ]
        //        callback(false);
        //    });

        //$scope.bookmarkList = response.dataFind;
        $scope.bookmarkList = [
            {
                "name" : "Google ES",
                "link" : "http://www.google.es"
            },
            {
                "name" : "Google COM",
                "link" : "http://www.google.com"
            }
        ]
    }


});
