app.controller('ResultController', function($scope, $rootScope, AuthService, $location) {
  $rootScope.showNavbar = true;
  $scope.currentUser = AuthService.getCurrentUser();

  if (!$scope.currentUser) {
    $location.path('/login');
    return;
  }

  $scope.result = JSON.parse(localStorage.getItem('lastResult') || 'null');
  $scope.canPrint = true;

  $scope.downloadPdf = function() {
    var doc = new window.jspdf.jsPDF();
    doc.setFontSize(16);
    doc.text('Exam Result', 20, 20);
    doc.setFontSize(12);
    doc.text('Student: ' + $scope.currentUser.name, 20, 35);
    doc.text('Score: ' + $scope.result.score, 20, 45);
    doc.text('Percentage: ' + $scope.result.percentage + '%', 20, 55);
    doc.text('Status: ' + ($scope.result.passed ? 'Passed' : 'Failed'), 20, 65);
    doc.save('exam-result.pdf');
  };

  $scope.printResult = function() {
    window.print();
  };
});
