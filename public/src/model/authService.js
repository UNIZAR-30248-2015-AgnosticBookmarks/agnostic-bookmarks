var app = angular.module('AgnosticBookmarks');

app.service('UserService', function ($http, $location, $base64) {

    var userData = null;

    return {
        authenticate: authenticate,
        logOut: logOut,
        getUserData: getUserData,
        register: register,
        getSessionState: getSessionState
    }

    function authenticate(user, pass, callback) {
        $http.get(
            "http://adriemsworkshop.noip.me:8081/bookmarks/api/auth/",
            { headers: {
                'Authorization': 'Basic ' + 
                    $base64.encode(user + ":" + pass)
            }}
        ).then(function onSuccess(response) {
                userData = {
                    username: user,
                    password: pass
                }
                callback(true);
            }, function onError(response) {
                callback(false);
            });
    }

    function register(user, pass, callback) {
        var credentials = {username: user, password: pass};
        $http.post(
            "http://adriemsworkshop.noip.me:8081/bookmarks/api/users/",
            JSON.stringify(credentials),
            {headers: {'Content-Type': 'application/json'}}
        ).then(function onSuccess(response) {
                userData = {
                    username: user,
                    password: pass
                }
                callback(true,response);
            }, function onError(response) {
                callback(false,response);
            });
    }

    function getUserData() {
        return userData;
    }

    function logOut() {
        userData = null;
    }

    function getSessionState() {
        if (userData == null) return 'disconnected';
        else return 'connected'
    }

});
