var module = angular.module('AgnosticBookmarks');
module.service('BookmarksService', function ($http, $location) {
    return {
        bookmarksList: bookmarksList
    }

    function bookmarksList(user, callback) {
        var user = {username: user};
        $http.get(
            "http://192.168.1.4:3000/api/userBookmarks",
            JSON.stringify(user),
            {headers: {'Content-Type': 'application/json'}}
        ).then(function onSuccess(response) {
           callback(response);
        });
    }
});
