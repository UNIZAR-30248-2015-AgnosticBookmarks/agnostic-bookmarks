
var app = angular.module('AgnosticBookmarks');
app.controller('bookmarkCtrl', function($scope, $state, BookMarkService) {
    $scope.listError = false;
    $scope.bookmarkList = [];
    $scope.getBmList = function() {

        //BookmarkService.getList($scope.user.name, onListResponse);
        BookMarkService.getList("cielito", onListResponse);
    };

    var onListResponse = function (result) {
        $scope.bookmarkList = result;
    }



});
