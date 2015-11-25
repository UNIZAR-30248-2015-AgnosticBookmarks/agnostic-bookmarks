var module = angular.module('AgnosticBookmarks');

module.service('BookmarkService', function ($http, $location) {
    
    return {
        getList: getList,
        addBookmark: addBookmark
    }

    function addBookmark(bookmark, user, callback) {
        var _bookmark = {
            name: bookmark.name,
            url: bookmark.link,
            description: bookmark.description
        };
        $http.post(
            "http://localhost:3000/api/bookmarks/",
            JSON.stringify(_bookmark),
            { headers: {
                'Content-Type': 'application/json',
                'username': user.username,
                'password': user.password
            }}
        ).then(function onSuccess(response) {
            console.log(response);
            callback(null, response);
        }, function onError(response) {
            console.log(response);
            callback(response);
        });
    }

    function getList(user, callback) {
        $http.get(
            "http://localhost:3000/api/bookmarks/",
            { headers: {
                'Content-Type': 'application/json',
                'username': user.username,
                'password': user.password
            }}
        ).then(function onSuccess(response) {
            callback(null, response);
        }, function onError(response) {
            callback(response);
        });

    }


});
