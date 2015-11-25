
var app = angular.module('AgnosticBookmarks');
app.controller('homeCtrl', function($scope, $rootScope, $state, BookmarkService, UserService) {
    $scope.addError = false;
    $scope.bookmarkList = [];
    $scope.bookmarkToAdd = {};

    $scope.addBm = function() {
        $scope.addError = false;
        BookmarkService.addBookmark($scope.bookmarkToAdd, UserService.getUserData(), onAddResponse);
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
    getBookmarkList();
});
