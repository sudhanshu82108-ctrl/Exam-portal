var app = angular.module('examPortalApp', ['ngRoute']);

app.run(function($rootScope, $location, AuthService, DataService) {
  $rootScope.currentUser = AuthService.getCurrentUser();
  $rootScope.showNavbar = true;
  $rootScope.isLoading = false;
  $rootScope.toasts = [];
  $rootScope.darkMode = localStorage.getItem('darkMode') === 'true';

  $rootScope.$on('$routeChangeStart', function() {
    $rootScope.isLoading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function() {
    $rootScope.isLoading = false;
  });

  $rootScope.logout = function() {
    AuthService.logout();
    $location.path('/login');
  };

  $rootScope.toggleTheme = function() {
    $rootScope.darkMode = !$rootScope.darkMode;
    localStorage.setItem('darkMode', $rootScope.darkMode);
  };

  $rootScope.showToast = function(message) {
    $rootScope.toasts.push({ message: message, visible: true });
    setTimeout(function() {
      $rootScope.toasts.shift();
      $rootScope.$applyAsync();
    }, 2500);
  };

  $rootScope.dismissToast = function(index) {
    $rootScope.toasts.splice(index, 1);
  };

  DataService.seedData();
});
