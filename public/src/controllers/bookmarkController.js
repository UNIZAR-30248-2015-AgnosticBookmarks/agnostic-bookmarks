
var app = angular.module('AgnosticBookmarks');
app.controller('homeCtrl', function($scope, $rootScope, $state, BookmarkService, UserService) {
    $scope.addError = false;
    $scope.bookmarkList = [];
    $scope.bookmarkToAdd = {};
    $scope.addBm = function() {
        $scope.addError = false;
        //BookmarkService.getList($scope.user.name, onListResponse);
        //$scope.bookmarkToAdd.username = $rootScope.user;
        //$scope.bookmarkToAdd.username = "alberto";
        BookmarkService.addBookmark($scope.bookmarkToAdd, UserService.getUserData(), onAddResponse);
    };


    $scope.getBmList = function() {

        //BookMarkService.getList($scope.user.name, onListResponse);
        BookmarkService.getList(UserService.getUserData(), onListResponse);
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



});
