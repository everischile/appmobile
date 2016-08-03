app.controller('proyectoCtrl', [
  '$scope', '$state', '$ionicLoading', 'UtilsFactory', '$rootScope', 'UsuarioFactory', '$ionicViewSwitcher', '$ionicPopup',
  function ($scope, $state, $ionicLoading, UtilsFactory, $rootScope, UsuarioFactory, $ionicViewSwitcher, $ionicPopup) {

    $scope.$on('$stateChangeSuccess', function($evento, $estado){
      if ($estado.name === "proyecto") {

      }
    });

  }]);
