app.factory('UsuarioProvider', ['ServiceProvider', 'UtilsFactory', '$rootScope', function (ServiceProvider, UtilsFactory, $rootScope) {

  var successCallback, failureCallback;
  var header = {
    "Content-Type": "application/json"
  };

  var fail = function (response) {
    failureCallback(response);
  };

  var success = function (response) {
    successCallback(response);
  };

  var loginUser = function (username, password) {
    var properties = $rootScope.properties;
    var url = properties.APPWARE.URL_LOGIN;
    var params = {
    };
    var data = {
      username: username,
      password: password
    };
    ServiceProvider.callJSON(url, params, data, header, success, fail);
  };

  return {
    loginUser: function (username, password, success, failure) {
      successCallback = success;
      failureCallback = failure;
      loginUser(username, password);
    },
  };
}]);
