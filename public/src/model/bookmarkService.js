var module = angular.module('AgnosticBookmarks');

module.service('BookmarkService', function ($http, $location, $base64) {

    return {
        getList: getList,
        search: search,
        addBookmark: addBookmark,
        deleteBookmark: deleteBookmark,
        updateBookmark: updateBookmark,
        getTags: getLabels
    }

    function addBookmark(bookmark, user, callback) {
        var _bookmark = {
            name: bookmark.name,
            url: bookmark.url,
            tags: bookmark.tags,
            description: bookmark.description
        };
        $http.post(
            "http://localhost:3000/api/bookmarks/",
            JSON.stringify(_bookmark),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' +
                        $base64.encode(user.username + ":" + user.password)
                }
            }
        ).then(function onSuccess(response) {
            console.log(response);
            callback(null, response.data);
        }, function onError(response) {
            console.log(response);
            callback(response.data);
        });
    }

    function getList(user, params, callback) {
        $http.get(
            "http://localhost:3000/api/bookmarks/", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' +
                    $base64.encode(user.username + ":" + user.password)
            },
            params: params
        }).then(function onSuccess(response) {
            callback(null, response.data);
        }, function onError(response) {
            callback(response.data);
        });
    }

    function search(user, params, callback) {
        $http.get(
            "http://localhost:3000/api/bookmarks/search", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' +
                    $base64.encode(user.username + ":" + user.password)
            },
            params: params
        }).then(function onSuccess(response) {
            callback(null, response.data);
        }, function onError(response) {
            callback(response.data);
        });
    }

    function deleteBookmark(id, user, callback) {
        $http.delete(
            "http://localhost:3000/api/bookmarks/" + id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' +
                        $base64.encode(user.username + ":" + user.password)
                }
            }
        ).then(function onSuccess(response) {
            console.log(response);
            callback(null, response.data);
        }, function onError(response) {
            console.log(response);
            callback(response.data);
        });
    }

    function updateBookmark(bookmark, user, callback) {
        var _bookmark = {
            //_id: bookmark._id,
            name: bookmark.name,
            url: bookmark.url,
            description: bookmark.description
        };
        $http.patch(
            "http://localhost:3000/api/bookmarks/" + bookmark._id,
            JSON.stringify(_bookmark),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' +
                        $base64.encode(user.username + ":" + user.password)
                }
            }
        ).then(function onSuccess(response) {
                console.log(response);
                callback(null, response.data);
            }, function onError(response) {
                console.log(response);
                callback(response.data);
            });
    }

    function getLabels(user, callback) {
        $http.get(
            "http://localhost:3000/api/tags", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' +
                    $base64.encode(user.username + ":" + user.password)
            },
        }).then(function onSuccess(response) {
            callback(null, response.data);
        }, function onError(response) {
            callback(response.data);
        });
    }

});
