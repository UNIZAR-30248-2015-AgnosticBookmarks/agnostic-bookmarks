
var app = angular.module('AgnosticBookmarks');
app.controller('bookmarkCtrl', function($scope, $state, BookmarkService) {
    $scope.listError = false;
    $scope.bookmarkList = [];
    $scope.getBmList = function() {

        //BookmarkService.getList($scope.user.name, onListResponse);
        BookmarkService.getList("cielito", onListResponse);
    };

    var onListResponse = function (result) {
        if (result) listError = false;
        else $scope.listError = true;
    }




});
