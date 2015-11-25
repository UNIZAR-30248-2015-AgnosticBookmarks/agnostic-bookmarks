
var app = angular.module('AgnosticBookmarks');
app.controller('homeCtrl', function($scope, $rootScope, $state, BookmarkService, UserService) {
    $scope.addError = false;
    $scope.bookmarkList = [];
    $scope.bookmarkToAdd = {};

    $scope.sortCriteriaOptions = [
        { name: 'Date', value: 'date' },
        { name: 'Name', value: 'name' }
    ];
    $scope.sortCriteria = $scope.sortCriteriaOptions[0].value;
    $scope.changeSortCriteria = function() {
        getBookmarkList($scope.sortCriteria);
    }
    
    $scope.addBm = function() {
        $scope.addError = false;
        BookmarkService.addBookmark($scope.bookmarkToAdd, UserService.getUserData(), onAddResponse);
        getBookmarkList($scope.sortCriteria);
    };

    getBookmarkList = function(sortCriteria) {
        var params = { sortBy: sortCriteria }
        BookmarkService.getList(UserService.getUserData(), params, onListResponse);
    };

    $scope.logout = function() {
        UserService.logOut();
        $state.go('access');
    }

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
    getBookmarkList($scope.sortCriteria);
});
