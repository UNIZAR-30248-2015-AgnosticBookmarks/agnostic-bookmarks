// =============================================================================
//  This file defines the AngularJS module and the routes for the front-end,
//  that will be handled by ui-router
// -----------------------------------------------------------------------------
//  TODO: Add middleware before 'access' to check if user is already logged in
//  TODO: Add middleware before each state except for 'access' to check if
//        user is still logged in
// =============================================================================

var module = angular.module('AgnosticBookmarks', ['ui.router', 'base64']);

module.config(function($stateProvider, $urlRouterProvider) {

    function checkLoggedIn(UserService, state) {
        var sessionState = UserService.getSessionState();
        if (sessionState === 'disconnected') state.go('access');
    }

    function checkNotLoggedIn(UserService, state) {
        var sessionState = UserService.getSessionState();
        if (sessionState === 'connected') state.go('home');
    }

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'components/views/home.html',
            controller: 'homeCtrl',
            onEnter: ['UserService', '$state', checkLoggedIn]

        })
        .state('access', {
            url: '/access',
            templateUrl: 'components/views/access.html',
            controller: 'accessCtrl',
            onEnter: ['UserService', '$state', checkNotLoggedIn]
        })

    $urlRouterProvider.otherwise('/access');
})
