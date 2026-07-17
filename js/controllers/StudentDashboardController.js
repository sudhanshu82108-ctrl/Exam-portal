app.controller('StudentDashboardController', function($scope, $rootScope, DataService, AuthService, $location) {
  $scope.currentUser = AuthService.getCurrentUser();
  $rootScope.showNavbar = true;

  if (!$scope.currentUser || $scope.currentUser.role !== 'student') {
    $location.path('/login');
    return;
  }

  $scope.searchExam = '';
  $scope.profile = angular.copy($scope.currentUser);
  $scope.exams = [
    { id: 1, title: 'HTML Fundamentals', subject: 'HTML', duration: 20, status: 'Available' },
    { id: 2, title: 'CSS Styling', subject: 'CSS', duration: 20, status: 'Available' },
    { id: 3, title: 'JavaScript Basics', subject: 'JavaScript', duration: 25, status: 'Upcoming' }
  ];
  $scope.results = DataService.getResults().filter(function(item) { return item.userId === $scope.currentUser.id; });
  $scope.history = DataService.getExamHistory().filter(function(item) { return item.userId === $scope.currentUser.id; });
  $scope.metrics = {
    examsTaken: $scope.history.length,
    averageScore: $scope.results.length ? Math.round($scope.results.reduce(function(sum, item) { return sum + item.score; }, 0) / $scope.results.length) : 0,
    pendingExams: $scope.exams.filter(function(exam) { return exam.status === 'Upcoming'; }).length
  };

  $scope.startExam = function(exam) {
    localStorage.setItem('activeExam', JSON.stringify({ exam: exam, userId: $scope.currentUser.id }));
    $location.path('/exam');
  };

  $scope.saveProfile = function() {
    var users = DataService.getUsers();
    var index = users.findIndex(function(user) { return user.id === $scope.currentUser.id; });
    if (index >= 0) {
      users[index] = angular.extend(users[index], $scope.profile);
      localStorage.setItem('examUsers', JSON.stringify(users));
      localStorage.setItem('examCurrentUser', JSON.stringify(users[index]));
      $rootScope.currentUser = users[index];
      $scope.currentUser = users[index];
      $rootScope.showToast('Profile updated successfully.');
    }
  };

  $scope.changePassword = function() {
    if (!$scope.currentPassword || !$scope.newPassword) {
      $rootScope.showToast('Please fill both password fields.');
      return;
    }
    var users = DataService.getUsers();
    var index = users.findIndex(function(user) { return user.id === $scope.currentUser.id && user.password === $scope.currentPassword; });
    if (index >= 0) {
      users[index].password = $scope.newPassword;
      localStorage.setItem('examUsers', JSON.stringify(users));
      $rootScope.showToast('Password updated.');
      $scope.currentPassword = '';
      $scope.newPassword = '';
    } else {
      $rootScope.showToast('Current password is incorrect.');
    }
  };
});
