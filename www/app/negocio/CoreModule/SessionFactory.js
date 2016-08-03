CoreModule.factory('SessionFactory', ['$q', '$http', 'UtilsFactory', function ($q, $http, UtilsFactory) {

  var setAccessToken = function (value) {
    UtilsFactory.setLocalStoreObject('token', value);
  };

  var getRefreshToken = function(){
    var token = UtilsFactory.getLocalStoreObject('token');
    if(token) {
      return token.refreshToken;
    }
  };


  return {
    getCajetinToken: function(){
      return UtilsFactory.getLocalStoreObject('tokenCajetin');
    },
    setCajetinToken: function(value){
      UtilsFactory.setLocalStoreObject('tokenCajetin', value);
    },
    getAccessCode: function(){
      return UtilsFactory.getLocalStoreObject('loginCode');
    },
    setAccessCode: function(value){
      UtilsFactory.setLocalStoreObject('loginCode', value);
    },
    getAccessToken: function () {
      var token = UtilsFactory.getLocalStoreObject('token');
      if(token) {
        return token.accessToken;
      }
    },
    setAccessToken: setAccessToken,
    getRefreshToken: getRefreshToken,
    newAccessToken: function(accessToken, accessCode){
      var request = $q.defer();
      UtilsFactory.getEndpoints.get().$promise.then(function(endpoints){
        var endpoint = endpoints.ENDPOINTS_ACCESS_LOGIN_TOKEN;
        var callback = endpoints.ENDPOINTS_ACCESS_LOGIN_CALLBACK;
        var header = {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        var data = {
          'client_id': endpoints.SETUP.API_KEY,
          'client_secret': endpoints.SETUP.CLIENT_SECRET,
          'act_token': accessToken,
          'code': accessCode,
          'redirect_uri': callback,
          'grant_type': 'authorization_code'
        };
        $http({
          method: 'POST',
          responseType: 'json',
          url: endpoint,
          headers: header,
          data: Object.toparams(data)
        }).success(function(response){
          setAccessToken({
            accessToken: response.access_token,
            developerApp: response.developer_app,
            expiresIn: response.expires_in,
            refreshToken: response.refresh_token
          });
          request.resolve(response);
        }).error(function(error){
          request.reject(error);
        });
      });
      return request.promise;
    },
    refreshToken: function(){
      var request = $q.defer();
      UtilsFactory.getEndpoints.get().$promise.then(function(endpoints){
        var endpoint = endpoints.ENDPOINTS_ACCESS_LOGIN_TOKEN;
        var callback = endpoints.ENDPOINTS_ACCESS_LOGIN_CALLBACK;
        var header = {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        var data = {
          'client_id': endpoints.SETUP.API_KEY,
          'client_secret': endpoints.SETUP.CLIENT_SECRET,
          'refresh_token': getRefreshToken(),
          'redirect_uri': callback,
          'grant_type': 'refresh_token'
        };
        $http({
          method: 'POST',
          responseType: 'json',
          url: endpoint,
          headers: header,
          data: Object.toparams(data)
        }).success(function(response){
          setAccessToken({
            'accessToken': response.access_token,
            'developerApp': response.developer_app,
            'expiresIn': response.expires_in,
            'refreshToken': response.refresh_token
          });
          request.resolve(response);
        }).error(function(error){
          request.reject(error);
        });
      });
      return request.promise;
    }
  };

}]);
