
var app = angular.module('AgnosticBookmarks');
app.controller('accessCtrl', function($scope, $state, UserService) {
    $scope.showError = false;
    $scope.registerError = false;
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
        else $scope.showError = true;
    }

    var onRegisterResponse = function (result) {
        if (result) $state.go('home');
        else $scope.registerError = true;
    }

});
