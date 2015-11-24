
var app = angular.module('AgnosticBookmarks');
app.controller('bookmarkCtrl', function($scope, $state, BookMarkService) {
    $scope.addError = false;
    $scope.bookmarkList = [];
    $scope.addBm = function() {
        $scope.addError = false;
        //BookmarkService.getList($scope.user.name, onListResponse);
        //$scope.bookmarkToAdd.username = $scope.user.username;
        $scope.bookmarkToAdd.username = "alberto";
        BookMarkService.addBookmark($scope.bookmarkToAdd, onAddResponse);
    };


    $scope.getBmList = function() {

        BookmarkService.getList($scope.user.name, onListResponse);
        //BookMarkService.getList("cielito", onListResponse);
    };


    var onAddResponse = function (result) {
        $scope.addError = result;
    }
    var onListResponse = function (result) {
        $scope.bookmarkList = result;
    }



});
