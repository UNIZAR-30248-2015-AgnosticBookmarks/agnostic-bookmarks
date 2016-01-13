var app = angular.module('AgnosticBookmarks');

app.controller('homeCtrl', function($scope, $rootScope, $state, BookmarkService, UserService) {

    // Aux variables for adding/editting bookmarks
    $scope.showEditDialog = false; //FIXME: this should follow the dot rule
    $scope.selectedBookmark = { _id: -1 };
    $scope.controls = { search: null };
    var selectBookmark = function(bookmark) {
        var aux = {};
        aux._id = bookmark._id;
        aux.name = bookmark.name;
        aux.url = bookmark.url;
        aux.description = bookmark.description;
        $scope.selectedBookmark = aux;
    }

    /* BOOKMARK LIST MANAGEMENT */
    $scope.bookmarkList = [];
    var getBookmarkList = function(sortCriteria, offset, search) {
        var params = { sortBy: sortCriteria, offset: offset }
        if (search == null || search === "") {
            BookmarkService.getList(UserService.getUserData(), params,
                function(error, bookmarks) {
                    if (error) console.log(error);
                    else {
                        $scope.bookmarkList = bookmarks;
                    }
                });
        } else {
            params.search = search;
            BookmarkService.search(UserService.getUserData(), params,
                function(error, bookmarks) {
                    if (error) console.log(error);
                    else {
                        $scope.bookmarkList = bookmarks;
                    }
                });
        }
    };
    /* Sort criteria */
    $scope.sortCriteriaOptions = [
        { name: 'Date', value: 'date' },
        { name: 'Name', value: 'name' }
    ];
    $scope.sortCriteria = $scope.sortCriteriaOptions[0].value;
    $scope.changeSortCriteria = function() {
        $scope.bookmarksPage = 0;
        getBookmarkList($scope.sortCriteria,
                        $scope.bookmarksPage,
                        $scope.controls.search);
    }
    /* Search */
    $scope.search = function() {
        $scope.bookmarksPage = 0;
        getBookmarkList($scope.sortCriteria,
                        $scope.bookmarksPage,
                        $scope.controls.search);
    }
    $scope.cleanSearch = function() {
        $scope.bookmarksPage = 0;
        $scope.controls.search = null;
        getBookmarkList($scope.sortCriteria, $scope.bookmarksPage);
    }

    /* Pagination */
    $scope.bookmarksPage = 0;
    $scope.retrieveNextPage = function() {
        $scope.bookmarksPage++;
        getBookmarkList($scope.sortCriteria,
                        $scope.bookmarksPage,
                        $scope.controls.search);
    }
    $scope.retrievePrevPage = function() {
        $scope.bookmarksPage--;
        getBookmarkList($scope.sortCriteria,
                        $scope.bookmarksPage,
                        $scope.controls.search);
    }

    /* ERROR FLAGS */
    $scope.addError = false;
    $scope.deleteError = false;
    $scope.updateError = false;

    /* ERROR MESSAGE */
    $scope.errorMessage = "";

    /* ADD, UPDATE AND DELETE OPERATIONS */
    $scope.addBookmark = function() {
        $scope.addError = false;
        $scope.addErrorConflict = false;
        $scope.updateError = false;
        $scope.deleteError = false;
        $scope.selectedBookmark = { _id: -1 };
        $scope.showEditDialog = true;
    }
    $scope.updateBookmark = function(bookmarkIndex) {
        $scope.addError = false;
        $scope.addErrorConflict = false;
        $scope.updateError = false;
        $scope.deleteError = false;
        $scope.errorMessage = "";
        $scope.selectedBookmark = angular.copy($scope.bookmarkList[bookmarkIndex]);
        $scope.showEditDialog = true;
    }
    $scope.deleteBookmark = function(bookmarkIndex) {
        $scope.addError = false;
        $scope.addErrorConflict = false;
        $scope.updateError = false;
        $scope.deleteError = false;
        $scope.errorMessage = "";
        var myId = $scope.bookmarkList[bookmarkIndex]._id;
        BookmarkService.deleteBookmark(myId, UserService.getUserData(),
            function(error, result) {
                if (error) {
                    $scope.deleteError = true;
                    console.log("adderr5");
                    $scope.errorMessage = error.error;
                } else {
                    $scope.deleteError = false;
                    getBookmarkList($scope.sortCriteria, $scope.bookmarksPage);
                }
            });
    }
    $scope.saveBookmark = function() {
        if ($scope.selectedBookmark._id == -1) {
            $scope.addError = false;
            $scope.errorMessage = "";
            if($scope.selectedBookmark.url.slice(0,7).localeCompare("http://") || $scope.selectedBookmark.url.slice(0,8).localeCompare("https://"))  {
              BookmarkService.addBookmark(
                    $scope.selectedBookmark,
                    UserService.getUserData(),
                    function (error, result) {
                        if (error) {
                            console.log("adderr4");
                            $scope.addError = true;
                            $scope.errorMessage = error.error;
                        } else {
                            getBookmarkList($scope.sortCriteria, $scope.bookmarksPage);
                        }
                    });
            }
        else {
                console.log("adderr1");
                $scope.addError = true;
                $scope.errorMessage = "This is not a valid URL (URL must start with 'http://' or 'https://')";
            }
        } else {
            $scope.updateError = false;
            $scope.errorMessage = "";
            if($scope.selectedBookmark.url.slice(0,7).localeCompare("http://") || $scope.selectedBookmark.url.slice(0,8).localeCompare("https://"))  {
                BookmarkService.updateBookmark(
                    $scope.selectedBookmark,
                    UserService.getUserData(),
                    function (error, result) {
                        if (error) {
                            $scope.updateError = true;
                            console.log("adderr3");
                            $scope.errorMessage = error.error;
                        } else {
                            getBookmarkList($scope.sortCriteria, $scope.bookmarksPage);
                        }
                    });
            } else {
                console.log("adderr2");
                $scope.addError = true;
                $scope.errorMessage = "This is not a valid URL (URL must start with 'http://' or 'https://')";
            }
        }
    }

    /* NAVIGATION */
    $scope.logout = function() {
        UserService.logOut();
        $state.go('access');
    }

    // Load bookmark list on every page reload
    getBookmarkList($scope.sortCriteria, $scope.bookmarksPage);
});
