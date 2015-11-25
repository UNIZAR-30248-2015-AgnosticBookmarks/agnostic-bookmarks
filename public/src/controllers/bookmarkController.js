var app = angular.module('AgnosticBookmarks');

app.controller('homeCtrl', function($scope, $rootScope, $state, BookmarkService, UserService) {
    $scope.addError = false;
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
