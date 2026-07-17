app.factory('AuthService', function() {
  var service = {};

  service.login = function(username, password, role) {
    var users = JSON.parse(localStorage.getItem('examUsers') || '[]');
    var match = users.find(function(user) {
      return user.username === username && user.password === password && user.role === role;
    });

    if (match) {
      localStorage.setItem('examCurrentUser', JSON.stringify(match));
      return match;
    }

    return null;
  };

  service.register = function(user) {
    var users = JSON.parse(localStorage.getItem('examUsers') || '[]');
    users.push(user);
    localStorage.setItem('examUsers', JSON.stringify(users));
    return user;
  };

  service.logout = function() {
    localStorage.removeItem('examCurrentUser');
  };

  service.getCurrentUser = function() {
    return JSON.parse(localStorage.getItem('examCurrentUser') || 'null');
  };

  return service;
});
