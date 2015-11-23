
var app = angular.module('AgnosticBookmarks');
app.controller('accessCtrl', function($scope, $state, UserService) {
    $scope.showError = false;
    $scope.registerOK = false;
    $scope.registerError = false;
    $scope.enter = function() {
        UserService.authenticate($scope.user.name, $scope.user.password, onEnterResponse);
        //$scope.user = {name:pepe, password:"locolo"};
    };
    $scope.register = function() {
        UserService.register($scope.user.name, $scope.user.password, onRegisterResponse);
    };

    var onEnterResponse = function (result) {
        if (result) $state.go('home');
        else $scope.showError = true;
    }

    var onRegisterResponse = function (result) {
        if (result) $scope.registerOK = true;
        else $scope.registerError = true;
    }

});
