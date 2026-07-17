app.directive('portalCard', function() {
  return {
    restrict: 'E',
    template: '<div class="glass-card p-3 rounded-4 h-100"><ng-transclude></ng-transclude></div>',
    transclude: true
  };
});
