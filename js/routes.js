app.config(function($routeProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'AuthController'
    })
    .when('/student', {
      templateUrl: 'dashboard.html',
      controller: 'StudentDashboardController'
    })
    .when('/exam', {
      templateUrl: 'exam.html',
      controller: 'ExamController'
    })
    .when('/result', {
      templateUrl: 'result.html',
      controller: 'ResultController'
    })
    .when('/admin', {
      templateUrl: 'admin.html',
      controller: 'AdminController'
    })
    .otherwise({ redirectTo: '/login' });
});
