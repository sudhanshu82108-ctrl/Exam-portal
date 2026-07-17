app.factory('DataService', function($http) {
  var service = {};

  var defaultQuestions = [];
  var defaultUsers = [];

  service.seedData = function() {
    if (!localStorage.getItem('examUsers')) {
      $http.get('data/users.json').then(function(response) {
        defaultUsers = response.data;
        localStorage.setItem('examUsers', JSON.stringify(defaultUsers));
      });
    }

    if (!localStorage.getItem('examQuestions')) {
      $http.get('data/questions.json').then(function(response) {
        defaultQuestions = response.data;
        localStorage.setItem('examQuestions', JSON.stringify(defaultQuestions));
      });
    }
  };

  service.getQuestions = function() {
    return JSON.parse(localStorage.getItem('examQuestions') || '[]');
  };

  service.getUsers = function() {
    return JSON.parse(localStorage.getItem('examUsers') || '[]');
  };

  service.getResults = function() {
    return JSON.parse(localStorage.getItem('examResults') || '[]');
  };

  service.saveResult = function(result) {
    var results = service.getResults();
    results.push(result);
    localStorage.setItem('examResults', JSON.stringify(results));
  };

  service.saveExamHistory = function(history) {
    localStorage.setItem('examHistory', JSON.stringify(history));
  };

  service.getExamHistory = function() {
    return JSON.parse(localStorage.getItem('examHistory') || '[]');
  };

  service.saveQuestions = function(questions) {
    localStorage.setItem('examQuestions', JSON.stringify(questions));
  };

  return service;
});
