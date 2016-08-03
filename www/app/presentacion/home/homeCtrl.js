/**
 * Created by camilaeyzaguirre on 7/29/16.
 */
app.controller('homeCtrl', ['$scope', '$state', 'UsuarioFactory', '$ionicViewSwitcher', function ($scope, $state, UsuarioFactory, $ionicViewSwitcher) {

  console.log("home");

  $scope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
    if (to.name === "home") {
      console.log("$stateChangeSuccess home");
    }
  });
}]);

