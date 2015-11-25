
var app = angular.module('AgnosticBookmarks');
app.controller('bookmarkCtrl', function($scope, $rootScope, $state, BookMarkService) {
    $scope.addError = false;
    $scope.bookmarkList = [];
    $scope.addBm = function() {
        $scope.addError = false;
        //BookmarkService.getList($scope.user.name, onListResponse);
        $scope.bookmarkToAdd.username = $rootScope.user;
        //$scope.bookmarkToAdd.username = "alberto";
        BookMarkService.addBookmark($scope.bookmarkToAdd, onAddResponse);
    };


    $scope.getBmList = function() {

        //BookMarkService.getList($scope.user.name, onListResponse);
        BookMarkService.getList("mock", onListResponse);
    };


    var onAddResponse = function (result) {
        if(result) {
            $scope.addError = false;
        } else {
            $scope.addError = true;
        }

    }
    var onListResponse = function (result) {
        $scope.bookmarkList = result;
    }



});
