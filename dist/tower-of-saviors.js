(function() {
  var IndexController, a;

  a = angular.module('tos.controller', ['tos.provider']);

  IndexController = function($scope, $injector) {
    var $tos;
    $tos = $injector.get('$tos');
    return $tos.getCards();
  };

  IndexController.$inject = ['$scope', '$injector'];

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
    var $http, $injector,
      _this = this;
    $injector = null;
    $http = null;
    this.languages = {
      /*
      All language codes.
      */

      en: 'English',
      'zh-TW': '繁體中文'
    };
    this.currentLanguage = (function() {
      /*
      The current language code.
      */

      if (_this.languages[navigator.language] != null) {
        return navigator.language;
      } else {
        switch (navigator.language) {
          case 'zh-CN':
          case 'zh-HK':
            return 'zh-TW';
          default:
            return 'en';
        }
      }
    })();
    this.setupProvider = function(injector) {
      $injector = injector;
      return $http = $injector.get('$http');
    };
    this.getCards = function() {
      /*
      Get all cards.
      @return:
          id: {int} The card id.
          name: {string} The card name.
          imageSm: {string} The small image url.
          race: {string} The card's race. [human, dragon, beast, elf, god, fiend, ee(evolve elements)]
          attribute: {string} The card's attribute. [light, dark, water, fire, wood]
      */

      var v;
      v = $http({
        method: 'get',
        url: 'data/zh-TW/cards.js',
        transformResponse: [
          function(data) {
            var result;
            result = {};
            eval("result = " + (data.substr(1, data.length - 4)));
            return result;
          }
        ].concat($http.defaults.transformResponse)
      });
      v.success(function(data) {
        console.log('---- success ------');
        return console.log(data);
      });
      return [];
    };
    this.get = function($injector) {
      this.setupProvider($injector);
      return {
        languages: this.languages,
        currentLanguage: this.currentLanguage,
        getCards: this.getCards
      };
    };
    this.get.inject = ['$injector'];
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
