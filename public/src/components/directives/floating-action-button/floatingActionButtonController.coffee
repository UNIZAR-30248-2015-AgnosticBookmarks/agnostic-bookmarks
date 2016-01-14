module.directive 'floatingActionButton', () ->

  link = (scope, element, attrs) ->
    console.log element[0].querySelector('.floating-action-button')
    console.log scope.callback
  ### DIRECTIVE RETURN ###
  templateUrl: 'directives/floating-action-button/floating-action-button.html'
  scope: callback: '&clickCallback'
  link: link
  replace: true