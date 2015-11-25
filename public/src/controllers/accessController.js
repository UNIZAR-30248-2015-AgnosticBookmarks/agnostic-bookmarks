
var app = angular.module('AgnosticBookmarks');
app.controller('accessCtrl', function($scope, $state, UserService) {
    $scope.loginError = false;
    $scope.regError = false;
    $scope.createBoomarkError = false;
    $scope.enter = function() {
		$scope.loginError = false;
        $scope.registerError = false;
        UserService.authenticate($scope.user.name, $scope.user.password, onEnterResponse);
    };
    $scope.register = function() {
		$scope.registerError = false;
        $scope.loginError = false;
        UserService.register($scope.user.name, $scope.user.password, onRegisterResponse);
    };
    $scope.createBookmark = function(){
        $scope.createBookmarkError = false;
        UserService.newBookmark($scope.bm.title, $scope.bm.link, $scope. onCreateBookmarkResponse);
    };

    var onEnterResponse = function (result) {
        if (result) $state.go('home');
        else $scope.loginError = true;
    }
    var onRegisterResponse = function (result) {
        if (result){
            $state.go('home');
        }
        else $scope.regError = true;
    }
    var onCreateBookmarkResponse = function (result) {
        if (result) $state.go('home');
        else $scope.regError = true;
    }



});
