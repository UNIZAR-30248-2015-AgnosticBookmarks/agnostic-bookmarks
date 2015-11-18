
var app = angular.module('AgnosticBookmarks');
app.controller('accessCtrl', function($scope, $state, UserService) {
    $scope.showError = false;
    $scope.enter = function() {
        UserService.authenticate($scope.user.name, $scope.user.password, onEnterResponse);
        //$scope.user = {name:pepe, password:"locolo"};
    };

    var onEnterResponse = function (result) {
        if (result) $state.go('home');
        else $scope.showError = true;
    }

});
