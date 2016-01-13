// =============================================================================
//  This file defines the AngularJS module and the routes for the front-end,
//  that will be handled by ui-router
// =============================================================================

var module = angular.module('AgnosticBookmarks', ['ui.router', 'base64']);

module.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    // Router configuration
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

    // 401 Handling //FIXME doesn't working
    // var interceptor = function($rootScope, $q) {
        // return {
            // 'responseError': function(rejection) {
                // console.log("Intercepted!");
                // console.log(rejection);
                // if (rejection.status == 401) {
                    // console.log("Intercepted 2!");
                    // // $state.go('access'); return;
                    // return;
                // } else return $q.reject(response);
            // }
        // }
    // };
    // $httpProvider.interceptors.push(interceptor);
    // $httpProvider.interceptors.push("http401Interceptor");
})
