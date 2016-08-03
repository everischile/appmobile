app.controller('loginCtrl', [
  '$scope', '$state', '$ionicLoading', 'UtilsFactory', '$rootScope', 'UsuarioFactory', '$ionicViewSwitcher', '$ionicPopup',
  function ($scope, $state, $ionicLoading, UtilsFactory, $rootScope, UsuarioFactory, $ionicViewSwitcher, $ionicPopup) {

  $scope.goFacebook = function(){
    console.log("ingresar con facebook");
  };


  $scope.$on('$stateChangeSuccess', function($evento, $estado){
    if ($estado.name === "login") {

    }
  });

}]);

