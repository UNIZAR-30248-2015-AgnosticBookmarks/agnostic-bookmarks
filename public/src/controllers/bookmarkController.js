
var app = angular.module('AgnosticBookmarks');
app.controller('homeCtrl', function($scope, $rootScope, $state, BookmarkService, UserService) {
    $scope.addError = false;
    $scope.delError = false;
    $scope.updateError = false;
    $scope.bookmarkList = [];
    $scope.bookmarkToAdd = {};

    $scope.bookmarksPage = 0;
    $scope.retrieveNextPage = function() {
        $scope.bookmarksPage++;
        getBookmarkList($scope.sortCriteria, $scope.bookmarksPage);
    }
    $scope.retrievePrevPage = function() {
        $scope.bookmarksPage--;
        getBookmarkList($scope.sortCriteria, $scope.bookmarksPage);
    }

    $scope.sortCriteriaOptions = [
        { name: 'Date', value: 'date' },
        { name: 'Name', value: 'name' }
    ];
    $scope.sortCriteria = $scope.sortCriteriaOptions[0].value;
    $scope.changeSortCriteria = function() {
        $scope.bookmarksPage = 0;
        getBookmarkList($scope.sortCriteria, $scope.bookmarksPage);
    }

    $scope.addBm = function() {
        $scope.addError = false;
        BookmarkService.addBookmark($scope.bookmarkToAdd, UserService.getUserData(), onAddResponse);
        getBookmarkList($scope.sortCriteria, $scope.bookmarksPage);
    };

    $scope.delBm = function(id) {
        $scope.delError = false;
        var myId = $scope.bookmarkList[id]._id;
        BookmarkService.deleteBookmark(myId, UserService.getUserData(), onDelResponse);
        getBookmarkList();
    };

    $scope.updateBm = function(id) {
        $scope.updateError = false;
        var myId = $scope.bookmarkList[id]._id;
        BookmarkService.updateBookmark(myId, bookmarkToUpdate, UserService.getUserData(), onUpdateResponse);
        getBookmarkList();
    };


    getBookmarkList = function() {
        //BookMarkService.getList($scope.user.name, onListResponse);
        BookmarkService.getList(UserService.getUserData(), onListResponse);
    };

    $scope.logout = function() {
        UserService.logOut();
        $state.go('access');
    }

    var getBookmarkList = function(sortCriteria, offset) {
        var params = { sortBy: sortCriteria, offset: offset }
        BookmarkService.getList(UserService.getUserData(), params, onListResponse);
    };

    var onAddResponse = function (error, result) {
        if (error) {
            $scope.addError = true;
        } else {
            $scope.addError = false;
        }

    }
    var onDelResponse = function (error, result) {
        if (error) {
            $scope.delError = true;
        } else {
            $scope.delError = false;
        }

    }
    var onUpdateResponse = function (error, result) {
        if (error) {
            $scope.updateError = true;
        } else {
            $scope.updateError = false;
        }

    }
    var onListResponse = function (error, result) {
        if (error) console.err(error);
        else {
            console.log(result);
            $scope.bookmarkList = result;
        }
    }

    // Load bookmark list on every page reload
    getBookmarkList($scope.sortCriteria, $scope.bookmarksPage);
});
