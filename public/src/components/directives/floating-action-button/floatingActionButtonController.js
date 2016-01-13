var app = angular.module('AgnosticBookmarks');

app.directive('floatingActionButton', function() {

    var link = function (scope, element, attrs) {
        console.log(element[0].querySelector('.floating-action-button'));
        console.log(scope.callback);
    }

    return {
        templateUrl: 'components/directives/floating-action-button/floating-action-button.html',
        scope: { callback: '&clickCallback' },
        replace: true,
        link: link
    }
})
