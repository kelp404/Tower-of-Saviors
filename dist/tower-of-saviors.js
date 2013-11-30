(function() {
  var IndexController, a;

  a = angular.module('tos.controller', ['tos.provider']);

  IndexController = function($scope, $injector, cards) {
    return $scope.cards = cards;
  };

  IndexController.$inject = ['$scope', '$injector', 'cards'];

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
        switch (navigator.language.toLowerCase()) {
          case 'zh-tw':
          case 'zh-cn':
          case 'zh-hk':
            return 'zh-TW';
          default:
            return 'zh-TW';
        }
      }
    })();
    this.setupProvider = function(injector) {
      $injector = injector;
      return $http = $injector.get('$http');
    };
    this.getResource = function(url) {
      var h;
      h = $http({
        method: 'get',
        url: url,
        cache: true,
        transformResponse: [
          function(data) {
            return eval(data);
          }
        ].concat($http.defaults.transformResponse)
      });
      return h.error(function() {
        return console.log('error');
      });
    };
    this.getCards = function() {
      /*
      Get all cards.
      @return: {$http}
          id: {int} The card id.
          name: {string} The card name.
          imageSm: {string} The small image url.
          race: {string} The card's race. [human, dragon, beast, elf, god, fiend, ee(evolve elements)]
          attribute: {string} The card's attribute. [light, dark, water, fire, wood]
      */

      var h;
      h = _this.getResource("data/" + _this.currentLanguage + "/cards.min.js");
      return h.then(function(response) {
        var cards, id, ids, result, _i, _len;
        result = [];
        cards = response.data;
        ids = Object.keys(cards).sort(function(a, b) {
          return a - b;
        });
        for (_i = 0, _len = ids.length; _i < _len; _i++) {
          id = ids[_i];
          cards[id].id = id;
          result.push(cards[id]);
        }
        return result;
      });
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

  a = angular.module('tos.router', ['tos.controller', 'tos.provider', 'ui.router']);

  config = function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    return $stateProvider.state('index', {
      url: '/',
      resolve: {
        cards: [
          '$tos', function($tos) {
            return $tos.getCards();
          }
        ]
      },
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
