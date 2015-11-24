(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    function LoginController() {
        var ctrl = this;

        ctrl.login = login;

        function login() {
            console.log(ctrl.user+" "+ctrl.password);
        };
    }

})();