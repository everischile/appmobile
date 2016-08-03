angular.module('cordovaHttpModule', []).factory('cordovaHttp', ['$q', '$timeout', function ($q, $timeout) {

    function getPlugin(){
        return window.CordovaHttpPlugin || window.plugins.CordovaHttpPlugin;
    }

    function makePromise(fn, args, async) {
        var deferred = $q.defer();

        var success = function(response) {
            if (async) {
                $timeout(function() {
                    deferred.resolve(response);
                });
            } else {
                deferred.resolve(response);
            }
        };

        var fail = function(response) {
            if (async) {
                $timeout(function() {
                    deferred.reject(response);
                });
            } else {
                deferred.reject(response);
            }
        };

        args.push(success);
        args.push(fail);

        fn.apply(getPlugin(), args);

        return deferred.promise;
    }

    return {
        getBasicAuthHeader: function(){
            return getPlugin().getBasicAuthHeader;
        },


        useBasicAuth: function(username, password) {
            return getPlugin().useBasicAuth(username, password);
        },
        setHeader: function(header, value) {
            return getPlugin().setHeader(header, value);
        },
        enableSSLPinning: function(enable) {
            return makePromise(getPlugin().enableSSLPinning, [enable]);
        },
        acceptAllCerts: function(allow) {
            return makePromise(getPlugin().acceptAllCerts, [allow]);
        },
        validateDomainName: function(validate) {
            return makePromise(getPlugin().validateDomainName, [validate]);
        },
        post: function(url, params, headers) {
            return makePromise(getPlugin().post, [url, params, headers], true);
        },
        get: function(url, params, headers) {
            return makePromise(getPlugin().get, [url, params, headers], true);
        },
        delete: function(url, params, headers) {
            return makePromise(getPlugin().delete, [url, params, headers], true);
        },
        put: function(url, params, headers) {
            return makePromise(getPlugin().put, [url, params, headers], true);
        },
        postJson: function(url, params, headers) {
            return makePromise(getPlugin().postJson, [url, params, headers], true);
        },
        head: function(url, params, headers) {
            return makePromise(getPlugin().head, [url, params, headers], true);
        },
        uploadFile: function(url, params, headers, filePath, name) {
            return makePromise(getPlugin().uploadFile, [url, params, headers, filePath, name], true);
        },
        downloadFile: function(url, params, headers, filePath) {
            return makePromise(getPlugin().downloadFile, [url, params, headers, filePath], true);
        }
    };
}]);