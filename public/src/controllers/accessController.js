
var app = angular.module('AgnosticBookmarks');
app.controller('accessCtrl', function($scope, $rootScope, $state, UserService) {
    $scope.loginError = false;
    $scope.regError = false;
    $scope.bookmarkList = [];
    $rootScope.user = "";
    $scope.enter = function() {
		$scope.loginError = false;
        $scope.regError = false;
        UserService.authenticate($scope.user.name, $scope.user.password, onEnterResponse);
        //$scope.user = {name:pepe, password:"locolo"};
    };
    $scope.register = function() {
		$scope.regError = false;
        $scope.loginError = false;
        UserService.register($scope.newUser.name, $scope.newUser.password, onRegisterResponse);
    };

    var onEnterResponse = function (result) {
        if (result) {
            $rootScope.user = $scope.user.name;
            $state.go('home');
        }
        else $scope.loginError = true;
    }
    var onRegisterResponse = function (result) {
        if (result) {
            $rootScope.user = $scope.newUser.name;
            $state.go('home');
        }

        else $scope.regError = true;
    }



});
