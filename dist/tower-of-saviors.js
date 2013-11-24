(function() {
  var IndexController, a;

  a = angular.module('tos.controller', ['tos.provider']);

  IndexController = function($scope) {
    return console.log('index');
  };

  IndexController.$inject = ['$scope'];

  a.controller('IndexController', IndexController);

}).call(this);

(function() {
  var a;

  a = angular.module('tos.directive', ['tos.provider']);

}).call(this);

(function() {
  angular.module('tos', ['tos.router']);

}).call(this);

(function() {
  var a;

  a = angular.module('tos.provider', []);

  a.provider('$tos', function() {
    this.get = function() {};
    this.$get = this.get;
  });

}).call(this);

(function() {
  var a, config, run;

  a = angular.module('tos.router', ['tos.controller', 'ui.router']);

  config = function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    return $stateProvider.state('index', {
      url: '/',
      views: {
        content: {
          templateUrl: 'views/content/list.html',
          controller: 'IndexController'
        }
      }
    });
  };

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  a.config(config);

  run = function($injector) {
    var $rootScope, $state;
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    return $rootScope.$state = $state;
  };

  run.inject = ['$injector'];

  a.run(run);

}).call(this);
