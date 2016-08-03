
app.run(function($ionicPlatform, $rootScope, $log,UtilsFactory) {
  $rootScope.debug = true;
  $rootScope.secretAES = 'IDEATON';
  $rootScope.enablePinning = false;
  if($rootScope.debug) {
    $log.debug('Aplicacion Iniciada en Modo DEBUG');
  }
  $ionicPlatform.ready(function() {
    UtilsFactory.getProperties.get().$promise.then(function (properties) {
      //carga properties en rootScope, luego inicializa la DB
      $rootScope.properties = properties;
    });
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  UtilsFactory.getTranslation($rootScope);
  $ionicPlatform.registerBackButtonAction(function(event) {
  }, 100);
  $ionicPlatform.onHardwareBackButton(function() {
  });
  $ionicPlatform.offHardwareBackButton(function() {
  });
});
