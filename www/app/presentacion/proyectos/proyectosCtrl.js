app.controller('proyectosCtrl', [
  '$scope', '$state', '$ionicLoading', 'UtilsFactory', '$rootScope', 'UsuarioFactory', '$ionicViewSwitcher', '$ionicPopup',
  function ($scope, $state, $ionicLoading, UtilsFactory, $rootScope, UsuarioFactory, $ionicViewSwitcher, $ionicPopup) {

    $scope.goToProyecto = function(idproyecto){
      console.log(idproyecto);
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('menu.proyecto', { idproyecto: idproyecto } );
    };


    $scope.$on('$stateChangeSuccess', function($evento, $estado){
      if ($estado.name === "proyectos") {

      }
    });

  }]);
