
var app = angular.module('AgnosticBookmarks');
app.controller('accessCtrl', function($scope, $state, UserService) {
    $scope.loginError = false;
    $scope.regError = false;
    $scope.enter = function() {
		$scope.showError = false;
        UserService.authenticate($scope.user.name, $scope.user.password, onEnterResponse);
        //$scope.user = {name:pepe, password:"locolo"};
    };
    $scope.register = function() {
		$scope.registerError = false;
        UserService.register($scope.user.name, $scope.user.password, onRegisterResponse);
    };

    var onEnterResponse = function (result) {
        if (result) $state.go('home');
        else $scope.loginError = true;
    }
    var onRegisterResponse = function (result) {
        if (result) $state.go('home');

        else $scope.regError = true;
    }



});
