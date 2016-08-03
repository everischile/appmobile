
app.controller('menuCtrl', ['$scope', '$state', '$ionicSideMenuDelegate', '$ionicViewSwitcher', function ($scope, $state, $ionicSideMenuDelegate, $ionicViewSwitcher) {

  $scope.toggleSideMenu = function() {
    $ionicSideMenuDelegate.toggleRight();
  };

  $scope.goLogin = function(){
    $ionicViewSwitcher.nextDirection('forward');
    $state.go('menu.login');
  };

  $scope.goProyectos = function(){
    $ionicViewSwitcher.nextDirection('forward');
    $state.go('menu.proyectos', { clear: true } );
  }

  $scope.goHome = function(){
    $ionicViewSwitcher.nextDirection('forward');
    $state.go('menu.home', { clear: true } );
  };

}]);

