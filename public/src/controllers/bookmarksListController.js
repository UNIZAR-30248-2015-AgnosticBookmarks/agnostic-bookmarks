
var app = angular.module('AgnosticBookmarks');
app.controller('bookmarksListCtrl', function($scope, $state, BookmarksService) {
    $scope.getList = function() {
        BookmarksService.bookmarksList($scope.user.name, onListResponse);
    };

    var onListResponse = function (result) {
        $scope.showList = true;
    }

});