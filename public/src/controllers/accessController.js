
var app = angular.module('AgnosticBookmarks');
app.controller('accessCtrl', function($scope, $rootScope, $state, UserService) {
    $scope.loginError = false;
    $scope.regError = false;
    $scope.errorMessage = "";
    $scope.bookmarkList = [];
    $rootScope.user = "";
    $scope.enter = function() {
        $scope.errorMessage = "";
        $scope.loginError = false;
        $scope.regError = false;
        UserService.authenticate($scope.user.name, $scope.user.password, onEnterResponse);
    };
    $scope.register = function() {
        $scope.errorMessage = "";
        $scope.regError = false;
        $scope.loginError = false;
        if(($scope.newUser.password.length > 8 )&& $scope.newUser.password == $scope.newUser.repPassword) {
            UserService.register($scope.newUser.name, $scope.newUser.password, onRegisterResponse);
        } else {
            $scope.regError = true;
            if($scope.newUser.password.length < 8 ) {
                $scope.errorMessage = ": Password is too short";
            }else if($scope.newUser.password.length > 20) {
                $scope.errorMessage = ": Password is too long";
            } else {
                $scope.errorMessage = ": Passwords don't match";

            }
        }
    };

    var onEnterResponse = function (result) {
        if (result) {
            $rootScope.user = $scope.user.name;
            $state.go('home');
        }
        else {
            $scope.loginError = true;
            $scope.errorMessage = error.error;
        }
    }
    var onRegisterResponse = function (result) {
        if (result) {
            $rootScope.user = $scope.newUser.name;
            $state.go('home');
        }

        else {
            $scope.regError = true;
            $scope.errorMessage = ": "+error.error;
        }
    }



});
