UtilsModule.factory('UtilsFactory', ['$ionicPopup', '$resource', '$window', '$ionicLoading', '$rootScope', '$q', 'PopupFactory', 'ToastFactory', '$cordovaNetwork', function ($ionicPopup, $resource, $window, $ionicLoading, $rootScope, $q, PopupFactory, ToastFactory, $cordovaNetwork) {
    var encrypt = function (string) {
        if (!$rootScope.debug && string) {
            return CryptoJS.AES.encrypt(string, $rootScope.secretAES).toString();
        } else {
            return string;
        }
    };
    var decrypt = function (cypher) {
        if (!$rootScope.debug && cypher) {
            var bytes = CryptoJS.AES.decrypt(cypher, $rootScope.secretAES);
            return bytes.toString(CryptoJS.enc.Utf8);
        } else {
            return cypher;
        }
    };
    return {
        getDatetimeFormated: function (datetime) {
          return datetime.substring(0, 4) + "-" +
            datetime.substring(4, 6) + "-" +
            datetime.substring(6, 8) + " " +
            datetime.substring(8, 10) + ":" +
            datetime.substring(10, 12);
        },
        getCurrentDatetime: function (){
          var date = new Date();
          var day = date.getDate() < 10 ? "0"+date.getDate() : ""+date.getDate();
          var month = (date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : ""+(date.getMonth()+1);
          var year = date.getFullYear();
          var hour = date.getHours() < 10 ? "0"+date.getHours() : ""+date.getHours();
          var minute = date.getMinutes() < 10 ? "0"+date.getMinutes() : ""+date.getMinutes();
          var second = date.getSeconds() < 10 ? "0"+date.getSeconds() : ""+date.getSeconds();
          var milisecond = date.getMilliseconds() < 10 ? "0"+date.getMilliseconds() : ""+date.getMilliseconds();
          return ""+year+month+day+hour+minute+second+milisecond;
        },
        pad: function (n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        },
        checkConnection: function () {
          return $cordovaNetwork.isOnline();
        },
        checkGeneralConnection: function () {
          document.addEventListener("deviceready", function () {
            var type = $cordovaNetwork.getNetwork();
            var isOnline = $cordovaNetwork.isOnline();
            var isOffline = $cordovaNetwork.isOffline();
            // listen for Online event
            $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
              //Cambié a conectado
              var onlineState = networkState;
            });

            // listen for Offline event
            $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
              //Cambié a desconectado
              var offlineState = networkState;
            });
          }, false);
        },
        getTranslation: function ($scope) {
            //var language = $window.localStorage['language'];
            var languageFilePath = 'translations/translation-es.json';
            $resource(languageFilePath).get(function (data) {
                //success
                $scope.translation = data;
            }, function () {
                $ionicPopup.alert({
                    title: 'Error de localización',
                    template: 'Error al obtener datos de localización.'
                }).then(function (res) {
                    if (res) {
                        //$window.localStorage['language'] = 'none';
                        navigator.app.exitApp();
                    }
                });
            });
        },
        getProperties: $resource('properties/properties.json'),
        openLoadingModal: function () {
            ToastFactory.loading();
        },
        closeLoadingModal: function () {
            ToastFactory.hide();
        },
        cleanStores: function () {
            var keys = [];
            for (var i = 0; i < $window.localStorage.length; i++) {
                keys.push($window.localStorage.key(i));
            }
            for (var key in keys) {
                $window.localStorage.removeItem(keys[key]);
            }
        },
        cleanSpecificStores: function (key) {
            $window.localStorage.removeItem(key);
        },
        setLocalStoreValue: function (key, value) {
            $window.localStorage[key] = encrypt(value);
        },
        getLocalStoreValue: function (key) {
            return decrypt($window.localStorage[key]);
        },
        setLocalStoreObject: function ($name, $value, withPromise) {
            var localStorage = window.localStorage;
            /*if (!withPromise) {
                withPromise = false;
            }*/
            if (!withPromise) {
                try {
                    localStorage.setItem($name, encrypt(angular.toJson($value)));
                } catch ($e) {
                    throw $e;
                }
            } else {
                var q = $q.defer();
                try {
                    localStorage.setItem($name, encrypt(angular.toJson($value)));
                    q.resolve('OK');
                } catch ($e) {
                    q.reject();
                    throw $e;
                }
                return q.promise;
            }
        }, getLocalStoreObject: function ($name, withPromise) {
            var localStorage = window.localStorage;
            /*if (typeof withPromise === 'undefined' || typeof withPromise === 'null') {
                withPromise = false;
            }*/
            var name = '';
            if (!withPromise) {
                try {
                    name = localStorage.getItem($name);
                    if (name) {
                        return angular.fromJson(decrypt(name));
                    } else {
                        return undefined;
                    }
                } catch ($e) {
                    throw $e;
                }
            } else {
                var q = $q.defer();
                try {
                    name = localStorage.getItem($name);
                    if (name) {
                        name = angular.fromJson(decrypt(name));
                    }
                    q.resolve(name);
                } catch ($e) {
                    q.reject();
                    throw $e;
                }
                return q.promise;
            }

        },
        toBytes: function (value) {
            var has = function (string, byteGroup) {
                var has = _.upperCase(string);
                return has.indexOf(_.upperCase(byteGroup)) >= 0;
            };

            var convert = function (string, byteGroup) {
                string = _.replace(string, ' ', '');
                string = _.replace(string, byteGroup, '');
                string = _.replace(string, _.upperCase(byteGroup), '');
                string = _.replace(string, _.lowerCase(byteGroup), '');
                string = _.replace(string, _.camelCase(byteGroup), '');
                string = _.replace(string, _.capitalize(byteGroup), '');
                var multiply = 1;
                if (byteGroup === 'kB') {
                    multiply = 1024;
                }
                if (byteGroup === 'MB') {
                    multiply = 1024 * 1024;
                }
                if (byteGroup === 'GB') {
                    multiply = 1024 * 1024 * 1024;
                }
                return parseFloat(string) * multiply;
            };

            var bytes = function (bytes) {
                if (has(bytes, 'GB')) {
                    bytes = convert(bytes, 'GB');
                }
                if (has(bytes, 'MB')) {
                    bytes = convert(bytes, 'MB');
                }
                if (has(bytes, 'kB')) {
                    bytes = convert(bytes, 'kB');
                }
                if (has(bytes, 'bytes')) {
                    bytes = convert(bytes, 'bytes');
                }
                return bytes;
            };
            return bytes(value);
        },
        // Type info, warn, error
        tooltip: function (title, content, type, buttons, options) {
            PopupFactory.show(title, content, type || 'info', buttons, options);
        }
    };
}]);


