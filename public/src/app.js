// =============================================================================
//  This file defines the AngularJS module and the routes for the front-end,
//  that will be handled by ui-router
// -----------------------------------------------------------------------------
//  TODO: Add middleware before 'access' to check if user is already logged in
//  TODO: Add middleware before each state except for 'access' to check if
//        user is still logged in
// =============================================================================

var module = angular.module('AgnosticBookmarks', ['ui.router']);

module.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'components/views/home.html'
        })
        .state('access', {
            url: '/access',
            controller: 'LoginController',
            controllerAs: 'ctrl',
            templateUrl: 'components/views/access.html'
        })

    $urlRouterProvider.otherwise('/access');
})
