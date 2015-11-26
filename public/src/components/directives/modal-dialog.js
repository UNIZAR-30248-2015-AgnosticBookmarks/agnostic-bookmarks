var app = angular.module('AgnosticBookmarks');

/* CLOSE BUTTON DIRECTIVE */
app.directive('closeModalDialog', function() {
    return {
        replace: true,
        template: 
            '<button type="button" class="close" data-dismiss="modal"' +
                'aria-label="Close"><span aria-hidden="true">&times;</span>' +
            '</button>'
    }
});

/* MODAL DIALOG WRAPPER */
app.directive('ngModalDialog', function() {
    var scope = {
        modalId: '@modalId',   // One way binding, expression expected
        show: '=modalVisible'  // Two way binding, variable name expected
    };

    var template = 
        '<div class="modal fade" ng-attr-id="{{modalID}}">' +
            '<div class="modal-dialog">' +
                '<div class="modal-content" ng-transclude>' +
                    // Content will go here
        '</div></div></div>';

    var link = function (scope, element, attrs) {
        // Set modalShow if not set
        if (!attrs.modalShow) attrs.modalShow = scope.modalId + "Visible";
        // Watch for changes on 'show' variable and change visibility
        // of the element through bootstrap javascript API
        scope.$watch('show', function(showValue) {
            console.log("Visibility changed to " + showValue);
            if (showValue) element.modal('show');
            else element.modal('hide');
        });
        // Update modalVisible value when it is opened via data attributes
        element.bind('shown.bs.modal', function() {
            console.log("Event 'shown.bs.modal' triggered");
            scope.$apply(function() {
                scope.$parent[attrs.modalVisible] = true;
            });
        });
        // Update modalVisible value when it is closed via data attributes
        element.bind('hidden.bs.modal', function() {
            console.log("Event 'hidden.bs.modal' triggered");
            scope.$apply(function() {
                scope.$parent[attrs.modalVisible] = false;
            });
        });
    };

    return {
        transclude: true,
        replace: true,
        restrict: 'EC',
        template: template,
        scope: scope,
        link: link
    };
});
