app.provider('ServiceProvider', function () {

  var uniqueRequests = false;
  var requests = [];
  var timeout;

  Object.toparams = function (obj) {
    var p = [];
    for (var key in obj) {
      p.push(key + '=' + encodeURIComponent(obj[key]));
    }
    return p.join('&');
  };

  return {
    $get: ['$rootScope', '$http', 'SessionFactory', 'UtilsFactory', '$log', '$timeout', '$q','cordovaHttp', function ($rootScope, $http, SessionFactory, UtilsFactory, $log, $timeout, $q,cordovaHttp) {

      var cancel = function (defer) {
        defer.reject('Logout');
      };

      var createPromise = function () {
        var defer = $q.defer();
        $rootScope.$on('$Logout.ok', function () {
          cancel(defer);
        });
        var timeoutFunction = function () {
          $timeout(function () {
            defer.reject();
          }, timeout);
        };
        if (!timeout) {
          timeout = $rootScope.properties.SETUP.TIMEOUT;
          timeoutFunction();
        } else {
          timeoutFunction();
        }
        return defer;
      };
      var setHeaderToken = function (headers) {
        var token = SessionFactory.getAccessToken();

        if(headers.cleanHeader){
          var header = {};
          delete headers.cleanHeader;
        }else{
          var header = {
            Accept: 'application/json'
          };
        }

        if (token && !headers.Authorization) {
          angular.extend(header, headers, {
            Authorization: 'Bearer ' + token
          });

        } else {
          angular.extend(header, headers);
        }
        return header;
      };

      var doRequest = function (endpoint, params, data, headers, success, failure, checkToken, method, kind) {
        if (!angular.isDefined(checkToken)) {
          checkToken = true;
        }


        var header = setHeaderToken(headers);
        var id = _.uniqueId();
        $log.debugTitle('[' + id + '] REQUEST ' + method, endpoint);
        var defer = createPromise();
        defer.promise.then(function (response) {
          success(response);
        }, function (err) {
          failure(err);
        });

        var errorGenerico =   {
          data : {
            status : '704',
            estado : {
              glosaEstado : $rootScope.translation.MESSAGE_ERROR_GENERICO_SERVICES
            }
          },
          estado : {
            glosaEstado : $rootScope.translation.MESSAGE_ERROR_GENERICO_SERVICES
          },
          status : '704'
        };




        var request = {
          method: method,
          responseType: 'json',
          url: endpoint,
          headers: header,
          params: params,
          data: (kind === 'json') ? JSON.stringify(data) : Object.toparams(data),
          timeout: defer.promise
        };
        if (_.findIndex(requests, request) >= 0 && uniqueRequests) {
          return false;
        }

        try{
          requests.push(request);
          $http(request).then(function (response) {
            requests = _.drop(requests, request);
            $log.groupCollapsed('[' + id + '] RESULT REQUEST ' + method.toUpperCase() + '[' + endpoint + ']');
            $log.debug('Params: ', params);
            $log.debug('Data: ', data);
            $log.debug('Response: ', response);
            $log.groupEnd();
            defer.resolve(response);
          }, function (err) {
            requests = _.drop(requests, request);
            $log.groupCollapsed('[' + id + '] ERROR REQUEST ' + method.toUpperCase() + ' [' + endpoint + ']');
            $log.error('Params: ', params);
            $log.error('Data: ', data);
            $log.error('Response: ', err);
            $log.groupEnd();
            try{
              if(!err.data || 'Gateway Timeout' === err.data.fault.faultstring){
                defer.reject(errorGenerico);
                return;
              }
            }catch(error){
              if(!err.data){
                defer.reject(errorGenerico);
                return;
              }
            }
            // Revisar el error
            if (checkToken && err.data) {

              if(!err.data.estado){
                defer.reject(errorGenerico);
                return;
              }

              if (err.data.estado.codigoEstado === '401'){ // TOKEN EXPIRADO!
                SessionFactory.refreshToken().then(function () {
                  // Se reenvia la peticion una vez más.
                  doRequest(endpoint, params, data, headers, success, failure, false, method, kind);
                }, function () {
                  defer.reject(err);
                  UtilsFactory.tooltip('Error', 'No se logró completar la petición', 'error', [{text: 'Aceptar', type: 'button'}]);
                });
                return;
              }

            }
            defer.reject(err);


          });

        }catch(error){
          defer.reject(errorGenerico);
          return;
        }
      };

      var sendSslPining = function(endpoint, params, data, headers, success, failure, checkToken, method, kind) {


        if (!angular.isDefined(checkToken)) {
          checkToken = true;
        }

        var errorGenerico =   {
          data : {
            status : '704',
            estado : {
              glosaEstado : $rootScope.translation.MESSAGE_ERROR_GENERICO_SERVICES
            }
          },
          estado : {
            glosaEstado : $rootScope.translation.MESSAGE_ERROR_GENERICO_SERVICES
          },
          status : '704'
        };

        var errorCertificado =   {
          data : {
            status : '526',
            estado : {
              glosaEstado : $rootScope.translation.MESSAGE_SSL_PINNING_ERROR_CERTIFICADO
            }
          },
          estado : {
            glosaEstado : $rootScope.translation.MESSAGE_SSL_PINNING_ERROR_CERTIFICADO
          },
          status : '526'
        };

        var errorConectividad =   {
          data : {
            status : '527',
            estado : {
              glosaEstado : $rootScope.translation.MESSAGE_CONNECTION_WITHOUT_INTERNET
            }
          },
          estado : {
            glosaEstado : $rootScope.translation.MESSAGE_CONNECTION_WITHOUT_INTERNET
          },
          status : 527
        };

        var defer = createPromise();

        if($rootScope.enabledConnection){
          try{
            var variable = cordovaHttp.enableSSLPinning(true);
            variable.then(function (response) {

              var header = setHeaderToken(headers);
              var promesa;
              if('POST' === method){
                if(params){
                  if(params.apikey){
                    endpoint = endpoint + '?apikey=' + params.apikey;
                    if(params.type){
                      params.type = 'p';
                      endpoint = endpoint + '&type=' + params.type;
                    }
                  }
                }
                promesa = cordovaHttp.post(endpoint, data, header,success,failure, function (response) {
                }, function (err) {
                });
              }

              if('GET' === method){
                promesa = cordovaHttp.get(endpoint, params, header,success,failure, function (response) {
                }, function (err) {
                });
              }
              if('PUT' === method){
                if(params){
                  if(params.apikey){
                    endpoint = endpoint + '?apikey=' + params.apikey;
                  }
                }
                promesa = cordovaHttp.put(endpoint, data , header,success,failure, function (response) {
                }, function (err) {
                });
              }
              if('postJson' === method){
                if(params){
                  if(params.apikey){
                    endpoint = endpoint + '?apikey=' + params.apikey;
                    if(params.type){

                      params.type = 'p';
                      endpoint = endpoint + '&type=' + params.type;
                    }
                  }
                }
                promesa = cordovaHttp.postJson(endpoint, data , header,success,failure, function (response) {
                }, function (err) {
                });
              }
              if('DELETE' === method){
                if(params){
                  if(params.apikey){
                    endpoint = endpoint + '?apikey=' + params.apikey;
                    if(params.type){

                      params.type = 'p';
                      endpoint = endpoint + '&type=' + params.type;
                    }
                  }

                }
                promesa = cordovaHttp.delete(endpoint, params, header,success,failure, function (response) {
                }, function (err) {
                });
              }


              defer.promise.then(function (response) {
                success(response);
              }, function (err) {
                failure(err);
              });

              promesa.then(function (response) {
                response.data = JSON.parse(response.data);
                defer.resolve(response);
              }, function (err) {
                if(!err.error){
                  defer.reject(errorGenerico);
                  return;
                }

                /*try{
                 if(526 === err.status){
                 defer.reject(errorCertificado);
                 return;
                 }
                 }catch(error){
                 console.log('error condicion certificado',error);
                 }*/

                err.data = JSON.parse(err.error);



                try{
                  if(!err.data || 'Gateway Timeout' === err.data.fault.faultstring){
                    defer.reject(errorGenerico);
                    return;
                  }
                }catch(error){
                  if(!err.data){
                    defer.reject(errorGenerico);
                    return;
                  }
                }




                if (err.data.estado.codigoEstado === '401'){ // TOKEN EXPIRADO!
                  SessionFactory.refreshToken().then(function () {
                    // Se reenvia la peticion una vez más.
                    sendSslPining(endpoint, params, data, headers, success, failure, false, method, kind);
                  }, function () {
                    defer.reject(err);
                    UtilsFactory.tooltip('Error', 'No se logró completar la petición', 'error', [{text: 'Aceptar', type: 'button'}]);
                  });
                  return;
                }
                defer.reject(err);

              });

            }, function(error){
            });



          }catch(error){
            if (defer) defer.reject(errorGenerico);
            return;
          }
        }else{
          defer.promise.then(function (response) {
            success(response);
          }, function (err) {
            failure(err);
          });
          defer.reject(errorConectividad);
          return;
        }
      };
      var sendRequest = function (endpoint, params, data, headers, success, failure, method, kind) {
        doRequest(endpoint, params, data, headers, success, failure, true, method, kind);
      };

      var sendPost = function (endpoint, params, data, headers, success, failure, checkToken) { // jshint ignore:line
        if($rootScope.enablePinning){
          sendSslPining(endpoint, params, data, headers, success, failure, checkToken, 'POST');
        }else{
          doRequest(endpoint, params, data, headers, success, failure, checkToken, 'POST');
        }
      };

      var sendGet = function (endpoint, params, data, headers, success, failure, checkToken) {
        if($rootScope.enablePinning){
          sendSslPining(endpoint, params, data, headers, success, failure, checkToken, 'GET');
        }else{
          doRequest(endpoint, params, data, headers, success, failure, checkToken, 'GET');
        }

      };

      var sendJson = function (endpoint, params, data, headers, success, failure, checkToken) {
        if($rootScope.enablePinning){
          sendSslPining(endpoint, params, data, headers, success, failure, checkToken, 'postJson', 'json');
        }else{
          doRequest(endpoint, params, data, headers, success, failure, checkToken, 'POST', 'json');
        }
      };

      var sendPut = function (endpoint, params, data, headers, success, failure, checkToken) {
        if($rootScope.enablePinning){
          sendSslPining(endpoint, params, data, headers, success, failure, checkToken, 'PUT', 'json');
        }else{
          doRequest(endpoint, params, data, headers, success, failure, checkToken, 'PUT', 'json');
        }

      };
      var sendDelete = function (endpoint, params, data, headers, success, failure, checkToken) {
        if($rootScope.enablePinning){
          sendSslPining(endpoint, params, data, headers, success, failure, checkToken, 'DELETE');
        }else{
          doRequest(endpoint, params, data, headers, success, failure, checkToken, 'DELETE');
        }
      };
      var sendGetCms = function (endpoint, params, data, headers, success, failure, checkToken) {
        doRequest(endpoint, params, data, headers, success, failure, checkToken, 'GET');
      };

      return {
        call: sendPost,
        callGet: sendGet,
        callPut: sendPut,
        callJSON: sendJson,
        callRequest: sendRequest,
        callDelete: sendDelete,
        callGetCms : sendGetCms,
        sendSslPining : sendSslPining
      };
    }]
  };
});
