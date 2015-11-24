
var app = angular.module('AgnosticBookmarks');
app.controller('bookmarkCtrl', function($scopeL, $state, BookmarkService) {
    $scopeL.listError = false;
    $scopeL.bookmarkList = [];
    $scopeL.getBmList = function() {

        //BookmarkService.getList($scope.user.name, onListResponse);
        BookmarkService.getList("cielito", onListResponse);
    };

    var onListResponse = function (result) {
        if (result) listError = false;
        else $scope.listError = true;
    }




});
