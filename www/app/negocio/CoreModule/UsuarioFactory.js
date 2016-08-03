CoreModule.factory('UsuarioFactory', ['UtilsFactory','UsuarioProvider','$q', '$rootScope', function (UtilsFactory, UsuarioProvider, $q, $rootScope) {

  var setUserData = function(codigo, usuario, nombre, username, password, rememberme){
    var userData = {
      codigo: codigo,
      usuario: usuario,
      nombre: nombre,
      username: username,
      password: rememberme ? password : '',
      rememberme: rememberme,
    };
    UtilsFactory.setLocalStoreObject('userData', userData);
  };

  var getUserData = function () {
    var userData = UtilsFactory.getLocalStoreObject('userData');
    return userData;
  };
  var logoutUser = function () {
    UtilsFactory.cleanStores();
  };

  return {

    loginUser: function (username, password, rememberme) {
      var defer = $q.defer();
      var result = {
        returnCode: -999,
        returnMessage: ''
      };
      UsuarioProvider.loginUser(username, password, function(response){
        var data = response.data;
        if (data.codigo === "0"){
          setUserData(data.codigo, data.usuario, data.nombre, username, password, rememberme);
          result.returnCode = 0;
          result.returnMessage = "";
        }else{
          result.returnCode = data.codigo;
          result.returnMessage = data.msgeEror;
        }
        defer.resolve(result);
      }, function(){
        result.returnCode = 1;
        result.returnMessage = $rootScope.translation.MESSAGE_S001;
        defer.reject(result);
      });
      return defer.promise;
    },
    logoutUser: logoutUser,
    getUserData: getUserData,
    verifyUser: function (username, password) {
      var defer = $q.defer();
      var result = {
        returnCode: -999,
        returnMessage: ''
      };
      UsuarioProvider.loginUser(username, password, function(response){
        var data = response.data;
        if (data.codigo === "0"){
          result.returnCode = 0;
          result.returnMessage = "";
        }else{
          result.returnCode = data.codigo;
          result.returnMessage = data.msgeEror;
        }
        defer.resolve(result);
      }, function(){
        result.returnCode = 2;
        result.returnMessage = $rootScope.translation.MESSAGE_S002;
        defer.reject(result);
      });
      return defer.promise;
    },
  };

}]);
