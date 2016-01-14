var app = angular.module('AgnosticBookmarks');

app.directive('navbar', function($state, $location, UserService) {

    var link = function (scope, element, attrs) {
        scope.isActiveSection = function(path) { $location.path() == path; }
        scope.isLoggedIn = function() { return UserService.getSessionState() == "connected"; }
        scope.logOut = function() { UserService.logOut(); }
    }

    return {
        templateUrl: 'components/directives/navbar/navbar.html',
        scope: true,
        link: link
    }
})
