// Configuration
app
  .config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
  })
// Decorate $interval for Mobiles Apps
  .config(['$provide', function ($provide) {
    $provide.decorator('$interval', ['$delegate', '$rootScope', function ($delegate, $rootScope) {
      var interval = function () {
        var args = arguments;
        var g = Function.prototype.bind.call($delegate);
        var i = g.apply($delegate, args);
        $rootScope.$on('$App.pause', function () {
          $delegate.cancel(i);
        });
        $rootScope.$on('$App.resume', function () {
          g = Function.prototype.bind.call($delegate);
          i = g.apply($delegate, args);
        });
      };
      interval.cancel = $delegate.cancel;
      return interval;
    }]);
  }])
  // Configuration
  .config(['$provide', function($provide){
    $provide.decorator('numberFilter', ['$delegate', function($delegate){
      $delegate = function(n, fraction){
        var parsed = parseFloat(n, fraction);
        if (_.isNaN(parsed)) {
          if(_.isString(n)){
            return n;
          }
        }else{
          return parsed;
        }
      };
      return $delegate;
    }]);
  }])
  // Date filter using MomentJS
  .config(['$provide', function ($provide) {
    $provide.decorator('dateFilter', function ($delegate) {
      $delegate = function (date, format) {
        var d = new Date(date + ' +0000');
        /*jshint eqeqeq:false*/
        if (moment(d) != 'Invalid Date') { //eslint-disable-line
          d = new Date(date);
          if (d == 'Invalid Date'){ //eslint-disable-line
            return date;
          }
        }
        return moment(d).format(format);
      };
      return $delegate;
    });
  }])
  // Decorate Log to Support group function
  .config(['$provide', function ($provide) {
    $provide.decorator('$log', ['$delegate', 'DebugFactory', function ($delegate, DebugFactory) {
      var traceStyle = 'color: #3DBF9F; font-family: sans-serif; font-weight: bold; font-style: italic;';
      var logStyle = 'color: #404040; font-family: sans-serif; font-weight: bold;';
      var errorStyle = 'color: #E64E30; font-family: sans-serif; font-weight: bold;';
      var fatalStyle = 'color: red; font-family: sans-serif; font-weight: bold;';
      var debugStyle = 'color: #6372C9; font-family: sans-serif; font-weight: bold; font-style: italic;';
      var infoStyle = 'color: #00BDFF; font-family: sans-serif; font-weight: bold;';
      var groupStyle = 'color: #5D6662; font-family: sans-serif; font-style: italic;';
      var warnStyle = 'color: #FFD84B; font-family: sans-serif; font-weight: bold; font-style: italic;';

      window.onerror = $delegate.fatal = function (error, file, line, column, stack) {
        window.console.groupCollapsed('%cFATAL: ' + error, fatalStyle);
        window.console.info('%cARCHIVO: ', infoStyle, file + ':' + line + ':' + column);
        window.console.error('%cDETALLE: ', infoStyle, stack.stack);
        window.console.groupEnd();
        var argsFile = ['[FATAL]', error, file + ':' + line + ':' + column, stack.stack];
        var g = Function.prototype.bind.call(DebugFactory.put, DebugFactory);
        g.apply(DebugFactory.put, argsFile);
      };

      $delegate.trace = function () {
        var args = ['%cTRACE:', traceStyle];
        var argv = Array.prototype.slice.call(arguments);
        args.push(argv);
        args = _.flattenDeep(args);
        var c = Function.prototype.bind.call(window.console.log, console);
        c.apply(window.console.log, args);

        var argsFile = ['[TRACE]'];
        argsFile.push(argv);
        argsFile = _.flattenDeep(argsFile);
        var g = Function.prototype.bind.call(DebugFactory.put, DebugFactory);
        g.apply(DebugFactory.put, argsFile);
      };

      $delegate.log = function(){
        var args = ['%cLOG:', logStyle];
        var argv = Array.prototype.slice.call(arguments);
        args.push(argv);
        args = _.flattenDeep(args);
        var c = Function.prototype.bind.call(window.console.log, console);
        c.apply(window.console.log, args);

        var argsFile = ['[LOG]'];
        argsFile.push(argv);
        argsFile = _.flattenDeep(argsFile);
        var g = Function.prototype.bind.call(DebugFactory.put, DebugFactory);
        g.apply(DebugFactory.put, argsFile);
      };

      $delegate.warn = function(){
        var args = ['%cWARNING:', warnStyle];
        var argv = Array.prototype.slice.call(arguments);
        args.push(argv);
        args = _.flattenDeep(args);
        var c = Function.prototype.bind.call(window.console.warn, console);
        c.apply(window.console.warn, args);

        var argsFile = ['[WARNING]'];
        argsFile.push(argv);
        argsFile = _.flattenDeep(argsFile);
        var g = Function.prototype.bind.call(DebugFactory.put, DebugFactory);
        g.apply(DebugFactory.put, argsFile);
      };

      $delegate.debug = function(){
        var args = ['%cDEBUG:', debugStyle];
        var argv = Array.prototype.slice.call(arguments);
        args.push(argv);
        args = _.flattenDeep(args);
        var c = Function.prototype.bind.call(window.console.debug, console);
        c.apply(window.console.debug, args);

        var argsFile = ['[DEBUG]'];
        argsFile.push(argv);
        argsFile = _.flattenDeep(argsFile);
        var g = Function.prototype.bind.call(DebugFactory.put, DebugFactory);
        g.apply(DebugFactory.put, argsFile);
      };

      $delegate.info = function(){
        var args = ['%cINFO:', infoStyle];
        var argv = Array.prototype.slice.call(arguments);
        args.push(argv);
        args = _.flattenDeep(args);
        var c = Function.prototype.bind.call(window.console.info, console);
        c.apply(window.console.info, args);

        var argsFile = ['[INFO]'];
        argsFile.push(argv);
        argsFile = _.flattenDeep(argsFile);
        var g = Function.prototype.bind.call(DebugFactory.put, DebugFactory);
        g.apply(DebugFactory.put, argsFile);
      };

      $delegate.debugTitle = function(){
        var args = ['%c' + arguments[0], debugStyle];
        var argv = Array.prototype.slice.call(arguments);
        argv.splice(0, 1);
        args.push(argv);
        args = _.flattenDeep(args);
        var c = Function.prototype.bind.call(window.console.debug, console);
        c.apply(window.console.debug, args);

        var argsFile = ['[' + arguments[0] + ']'];
        argsFile.push(argv);
        argsFile = _.flattenDeep(argsFile);
        var g = Function.prototype.bind.call(DebugFactory.put, DebugFactory);
        g.apply(DebugFactory.put, argsFile);
      };
      $delegate.error = function(){
        var args = ['%cERROR:', errorStyle];
        var argv = Array.prototype.slice.call(arguments);
        if(argv[0].stack){
          argv[0] = argv[0].stack;
        }
        args.push(argv);
        args = _.flattenDeep(args);
        var c = Function.prototype.bind.call(window.console.error, console);
        c.apply(window.console, args);

        var argsFile = ['[ERROR]'];
        argsFile.push(argv);
        argsFile = _.flattenDeep(argsFile);
        var g = Function.prototype.bind.call(DebugFactory.put, DebugFactory);
        g.apply(DebugFactory.put, argsFile);
      };
      $delegate.group = function (text) {
        var args = ['%c' + text, groupStyle];
        args = _.flattenDeep(args);
        var c = Function.prototype.bind.call(window.console.group, console);
        c.apply(window.console.group, args);

        var argsFile = ['*** [DEBUG GROUP]', text];
        var g = Function.prototype.bind.call(DebugFactory.put, DebugFactory);
        g.apply(DebugFactory.put, argsFile);
      };
      $delegate.groupCollapsed = function (text) {
        var args = ['%c' + text, groupStyle];
        args = _.flattenDeep(args);
        var c = Function.prototype.bind.call(window.console.groupCollapsed, console);
        c.apply(window.console.groupCollapsed, args);

        var argsFile = ['*** [DEBUG GROUP]', text];
        var g = Function.prototype.bind.call(DebugFactory.put, DebugFactory);
        g.apply(DebugFactory.put, argsFile);
      };
      $delegate.groupEnd = function () {
        var ge = Function.prototype.bind.call(window.console.groupEnd, console);
        ge.apply(window.console.groupEnd, arguments);

        var g = Function.prototype.bind.call(DebugFactory.put, DebugFactory);
        g.apply(DebugFactory.put, ['*** [GROUP END]']);
      };
      return $delegate;
    }]);
  }])
  .config(['$ionicConfigProvider', function ($ionicConfigProvider) {
    $ionicConfigProvider.backButton.previousTitleText('');
    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.icon('ion-chevron-left');
    $ionicConfigProvider.platform.android.views.transition('ios');
    $ionicConfigProvider.form.checkbox("circle");
  }]);
