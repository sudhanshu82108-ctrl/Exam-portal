app.controller('AdminController', function($scope, $rootScope, DataService, AuthService, $location) {
  $rootScope.showNavbar = true;
  $scope.currentUser = AuthService.getCurrentUser();

  if (!$scope.currentUser || $scope.currentUser.role !== 'admin') {
    $location.path('/login');
    return;
  }

  $scope.questions = DataService.getQuestions();
  $scope.users = DataService.getUsers();
  $scope.results = DataService.getResults();
  $scope.subjectFilter = 'All';
  $scope.searchText = '';
  $scope.form = { id: null, subject: 'HTML', difficulty: 'Easy', question: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 };
  $scope.examForm = { title: '', subject: 'HTML', duration: 20, status: 'Available' };
  $scope.exams = [
    { id: 1, title: 'HTML Fundamentals', subject: 'HTML', duration: 20, status: 'Available' },
    { id: 2, title: 'CSS Styling', subject: 'CSS', duration: 20, status: 'Upcoming' }
  ];
  $scope.activeTab = 'dashboard';

  $scope.filteredQuestions = function() {
    return $scope.questions.filter(function(question) {
      var matchesSubject = $scope.subjectFilter === 'All' || question.subject === $scope.subjectFilter;
      var matchesSearch = !$scope.searchText || question.question.toLowerCase().indexOf($scope.searchText.toLowerCase()) !== -1;
      return matchesSubject && matchesSearch;
    });
  };

  $scope.addQuestion = function() {
    var question = angular.copy($scope.form);
    question.id = Date.now();
    $scope.questions.push(question);
    DataService.saveQuestions($scope.questions);
    $scope.form = { id: null, subject: 'HTML', difficulty: 'Easy', question: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 };
    $rootScope.showToast('Question added.');
  };

  $scope.editQuestion = function(question) {
    $scope.form = angular.copy(question);
    $scope.activeTab = 'add';
  };

  $scope.updateQuestion = function() {
    var index = $scope.questions.findIndex(function(item) { return item.id === $scope.form.id; });
    if (index >= 0) {
      $scope.questions[index] = angular.copy($scope.form);
      DataService.saveQuestions($scope.questions);
      $rootScope.showToast('Question updated.');
      $scope.form = { id: null, subject: 'HTML', difficulty: 'Easy', question: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 };
      $scope.activeTab = 'list';
    }
  };

  $scope.deleteQuestion = function(question) {
    $scope.questions = $scope.questions.filter(function(item) { return item.id !== question.id; });
    DataService.saveQuestions($scope.questions);
    $rootScope.showToast('Question deleted.');
  };

  $scope.addExam = function() {
    $scope.exams.push(angular.copy($scope.examForm));
    $scope.examForm = { title: '', subject: 'HTML', duration: 20, status: 'Available' };
    $rootScope.showToast('Exam added.');
  };

  $scope.analytics = {
    totalQuestions: $scope.questions.length,
    totalStudents: $scope.users.filter(function(user) { return user.role === 'student'; }).length,
    totalResults: $scope.results.length,
    passRate: $scope.results.length ? Math.round(($scope.results.filter(function(item) { return item.passed; }).length / $scope.results.length) * 100) : 0
  };
});
