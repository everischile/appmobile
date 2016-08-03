app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('menu', {
      url: '/menu',
      templateUrl: 'app/presentacion/core/menu/menu.html',
      abstract: true,
      controller: 'menuCtrl'
    })

    .state('menu.home', {
      url: '/home',
      params: {'clear': false},
      views: {
        'menuContent' :{
          templateUrl: "app/presentacion/home/home.html",
          controller: 'homeCtrl'
        }
      }
    })

    .state('menu.login', {
      url: '/login',
      params: {'clear': false},
      views: {
        'menuContent' :{
          templateUrl: "app/presentacion/login/login.html",
          controller: 'loginCtrl'
        }
      }
    })

    .state('menu.proyectos', {
      url: '/proyectos',
      params: {'clear': false},
      views: {
        'menuContent' :{
          templateUrl: "app/presentacion/proyectos/proyectos.html",
          controller: 'proyectosCtrl'
        }
      }
    })

    .state('menu.proyecto', {
      url: '/proyecto/:idproyecto',
      params: {'clear': false},
      views: {
        'menuContent' :{
          templateUrl: "app/presentacion/proyectos/proyecto.html",
          controller: 'proyectoCtrl'
        }
      }
    })

    /*.state('menu.prechequeo2', {
      url: '/prechequeo2',
      params: {'clear': false},
      views: {
        'menuContent' :{
          templateUrl: "app/presentacion/prechequeo/prechequeo2.html",
          controller: 'prechequeo2Ctrl'
        }
      }
    })

    .state('menu.prepago1', {
      url: '/prepago2',
      views: {
        'menuContent' :{
          templateUrl: 'app/presentacion/prepago/prepago1/prepago1.html',
          controller: 'prepago1Ctrl'
        }
      }
    })

    .state('menu.prepago2', {
      url: '/prepago2',
      views: {
        'menuContent' :{
          templateUrl: 'app/presentacion/prepago/prepago2/prepago2.html',
          controller: 'prepago2Ctrl'
        }
      }
    })

    .state('menu.prepago3', {
      url: '/prepago3',
      views: {
        'menuContent' :{
          templateUrl: 'app/presentacion/prepago/prepago3/prepago3.html',
          controller: 'prepago3Ctrl'
        }
      }
    })

    .state('menu.solicitudes', {
      url: '/solicitudes',
      views: {
        'menuContent' :{
          templateUrl: 'app/presentacion/solicitudes/solicitudes.html',
          controller: 'solicitudesCtrl',
        }
      }
    });
*/
    $urlRouterProvider.otherwise('menu/home');
}]);
