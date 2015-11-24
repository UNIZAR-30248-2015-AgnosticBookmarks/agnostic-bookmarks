var module = angular.module('AgnosticBookmarks');
module.service('BookMarkService', function ($http, $location) {
    return {
        getList: getList,
        addBookmark: addBookmark
    }

    function addBookmark(bookmark, callback) {
        var bm = {name: bookmark.name, username: bookmark.username, link: bookmark.link, description: bookmark.description};
        $http.post(
            "http://192.168.1.4:3000/api/addBookmark/",
            JSON.stringify(bm),
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
                        "name": "Google",
                        "username": "alberto",
                        "link": "http://www.google.es",
                        "labels": [
                            {}
                        ],
                        "description": "My Google stuff"
                    },
                    {
                        "name": "Github",
                        "username": "alberto",
                        "link": "http://github.com/albertorevel",
                        "labels": [
                            {
                                "L1": "git",
                                "L2": "programming"
                            }
                        ],
                        "description": "My online reps"
                    },
                    {
                        "name": "Other ",
                        "username": "alberto",
                        "link": "https://www.other.com",
                        "labels": [
                            {}
                        ],
                        "description": "Other"
                    }
                ]
                callback(bookmarkList);
            });

    }


});
