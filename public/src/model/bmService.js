var module = angular.module('AgnosticBookmarks');
module.service('BookmarkService', function ($http, $location) {
    return {
        getList: getList
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
