app.controller('ExamController', function($scope, $rootScope, DataService, AuthService, $location, $timeout) {
  $rootScope.showNavbar = true;
  $scope.currentUser = AuthService.getCurrentUser();

  if (!$scope.currentUser || $scope.currentUser.role !== 'student') {
    $location.path('/login');
    return;
  }

  var activeExam = JSON.parse(localStorage.getItem('activeExam') || 'null');
  $scope.questions = DataService.getQuestions();
  $scope.questions = $scope.questions.sort(function() { return 0.5 - Math.random(); }).slice(0, 5);
  $scope.currentIndex = 0;
  $scope.answers = {};
  $scope.review = {};
  $scope.timeLeft = 180;
  $scope.isFullScreen = false;
  $scope.progress = 0;
  $scope.showConfirm = false;
  $scope.answeredCount = 0;
  $scope.reviewCount = 0;

  $scope.getCurrentQuestion = function() {
    return $scope.questions[$scope.currentIndex];
  };

  $scope.selectOption = function(optionIndex) {
    var question = $scope.getCurrentQuestion();
    $scope.answers[question.id] = optionIndex;
    $scope.review[question.id] = false;
    $scope.updateProgress();
  };

  $scope.toggleReview = function() {
    var question = $scope.getCurrentQuestion();
    $scope.review[question.id] = !$scope.review[question.id];
    $scope.updateProgress();
  };

  $scope.nextQuestion = function() {
    if ($scope.currentIndex < $scope.questions.length - 1) {
      $scope.currentIndex++;
    }
  };

  $scope.previousQuestion = function() {
    if ($scope.currentIndex > 0) {
      $scope.currentIndex--;
    }
  };

  $scope.goToQuestion = function(index) {
    $scope.currentIndex = index;
  };

  $scope.updateProgress = function() {
    var answered = Object.keys($scope.answers).length;
    var total = $scope.questions.length;
    $scope.progress = Math.round((answered / total) * 100);
    $scope.answeredCount = answered;
    $scope.reviewCount = Object.keys($scope.review).filter(function(key) {
      return $scope.review[key];
    }).length;
  };

  $scope.getStatusClass = function(index) {
    var question = $scope.questions[index];
    if ($scope.currentIndex === index) return 'current';
    if ($scope.review[question.id]) return 'review';
    if ($scope.answers[question.id] !== undefined) return 'answered';
    return 'unanswered';
  };

  $scope.toggleFullScreen = function() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function() {});
      $scope.isFullScreen = true;
    } else {
      document.exitFullscreen();
      $scope.isFullScreen = false;
    }
  };

  $scope.submitExam = function() {
    var correct = 0;
    var wrong = 0;
    var unattempted = 0;
    angular.forEach($scope.questions, function(question) {
      if ($scope.answers[question.id] === undefined) {
        unattempted++;
      } else if ($scope.answers[question.id] === question.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    var score = correct;
    var percentage = Math.round((score / $scope.questions.length) * 100);
    var passed = percentage >= 60;
    var result = {
      userId: $scope.currentUser.id,
      examTitle: activeExam ? activeExam.exam.title : 'Quick Assessment',
      score: score,
      percentage: percentage,
      correctAnswers: correct,
      wrongAnswers: wrong,
      unattemptedQuestions: unattempted,
      timeTaken: 180 - $scope.timeLeft,
      passed: passed,
      submittedAt: new Date().toISOString()
    };

    DataService.saveResult(result);
    var history = DataService.getExamHistory();
    history.push({ userId: $scope.currentUser.id, examTitle: result.examTitle, completedAt: result.submittedAt });
    DataService.saveExamHistory(history);

    localStorage.setItem('lastResult', JSON.stringify(result));
    $location.path('/result');
  };

  $scope.$on('$locationChangeStart', function(event, newUrl) {
    if (newUrl.indexOf('/exam') === -1 && newUrl.indexOf('/result') === -1 && $scope.timeLeft > 0) {
      event.preventDefault();
      $scope.showConfirm = true;
    }
  });

  window.onbeforeunload = function() {
    return 'Your exam progress may be lost.';
  };

  var timer = setInterval(function() {
    $scope.timeLeft--;
    if ($scope.timeLeft <= 0) {
      clearInterval(timer);
      $scope.submitExam();
    }
    $scope.$apply();
  }, 1000);

  $scope.$on('$destroy', function() {
    clearInterval(timer);
    window.onbeforeunload = null;
  });

  $scope.updateProgress();
});
