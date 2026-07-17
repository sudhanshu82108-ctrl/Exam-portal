app.controller('AuthController', function($scope, $location, AuthService, $rootScope) {
  $scope.user = { username: '', password: '', role: 'student', rememberMe: false };
  $scope.authMode = 'student';
  $scope.showForgot = false;
  $rootScope.showNavbar = false;

  $scope.toggleMode = function(mode) {
    $scope.authMode = mode;
    $scope.user.role = mode;
  };

  $scope.login = function() {
    if (!$scope.user.username || !$scope.user.password) {
      $rootScope.showToast('Please enter both username and password.');
      return;
    }

    var user = AuthService.login($scope.user.username, $scope.user.password, $scope.user.role);
    if (user) {
      if ($scope.user.rememberMe) {
        localStorage.setItem('examRememberMe', JSON.stringify({ username: $scope.user.username, role: $scope.user.role }));
      } else {
        localStorage.removeItem('examRememberMe');
      }
      $rootScope.currentUser = user;
      $location.path(user.role === 'admin' ? '/admin' : '/student');
    } else {
      $rootScope.showToast('Invalid credentials.');
    }
  };

  var remembered = JSON.parse(localStorage.getItem('examRememberMe') || 'null');
  if (remembered) {
    $scope.user.username = remembered.username;
    $scope.user.role = remembered.role;
    $scope.user.rememberMe = true;
  }
});
