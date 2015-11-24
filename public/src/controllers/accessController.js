
var app = angular.module('AgnosticBookmarks');
app.controller('accessCtrl', function($scope, $state, UserService) {
    $scope.loginError = false;
    $scope.regError = false;
    $scope.listError = false;
    $scope.bookmarkList = [];
    $scope.enter = function() {
		$scope.loginError = false;
        $scope.registerError = false;
        UserService.authenticate($scope.user.name, $scope.user.password, onEnterResponse);
        //$scope.user = {name:pepe, password:"locolo"};
    };
    $scope.register = function() {
		$scope.registerError = false;
        $scope.loginError = false;
        UserService.register($scope.user.name, $scope.user.password, onRegisterResponse);
    };
    $scope.getBmList = function() {

        //BookmarkService.getList($scope.user.name, onListResponse);
        UserService.getList("cielito", onListResponse);
    };

    var onEnterResponse = function (result) {
        if (result) $state.go('home');
        else $scope.loginError = true;
    }
    var onRegisterResponse = function (result) {
        if (result) $state.go('home');

        else $scope.regError = true;
    }
    var onListResponse = function (result) {
        $scope.bookmarkList = result;
    }



});
