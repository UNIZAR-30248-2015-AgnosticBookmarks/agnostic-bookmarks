
var app = angular.module('AgnosticBookmarks');
app.controller('formCtrl', function($scope) {
    $scope.enter = function() {
        if (true) {
            window.location.assign("www.google.es");
        } else {
            window.location.assign("www.google.es");
        }
        $scope.user = {name:pepe, password:"locolo"};
    };
});
