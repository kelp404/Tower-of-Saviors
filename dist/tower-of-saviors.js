(function() {
  var CardController, IndexController, a;

  a = angular.module('tos.controller', ['tos.provider']);

  IndexController = function($scope, $injector, cards) {
    return $scope.cards = cards;
  };

  IndexController.$inject = ['$scope', '$injector', 'cards'];

  a.controller('IndexController', IndexController);

  CardController = function($scope, $injector, card) {
    var $rootScope, $tos, id, _i, _j, _len, _ref, _ref1, _results;
    $tos = $injector.get('$tos');
    $rootScope = $injector.get('$rootScope');
    $rootScope.$state.current.resolve.title = function() {
      return "" + card.name + " - ";
    };
    $scope.card = card;
    $scope.rarityArray = (function() {
      _results = [];
      for (var _i = 0, _ref = card.rarity; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this);
    $scope.dependencies = {
      cards: {}
    };
    if (card.evolve.origin) {
      $tos.getCard(card.evolve.origin).success(function(data) {
        return $scope.dependencies.cards[card.evolve.origin] = data;
      });
    }
    _ref1 = card.evolve.resources;
    for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
      id = _ref1[_j];
      $tos.getCard(id).success(function(data) {
        return $scope.dependencies.cards[id] = data;
      });
    }
    if (card.evolve.result) {
      return $tos.getCard(card.evolve.result).success(function(data) {
        return $scope.dependencies.cards[card.evolve.result] = data;
      });
    }
  };

  CardController.$inject = ['$scope', '$injector', 'card'];

  a.controller('CardController', CardController);

}).call(this);

(function() {
  var a, tosFadeinOnload, tosLang;

  a = angular.module('tos.directive', ['tos.provider']);

  tosLang = function($injector) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var $tos;
        $tos = $injector.get('$tos');
        return attrs.$observe('tosLang', function(value) {
          return element.text($tos._(value));
        });
      }
    };
  };

  tosLang.$inject = ['$injector'];

  a.directive('tosLang', tosLang);

  tosFadeinOnload = function() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        return element.bind('load', function() {
          return element.addClass('in');
        });
      }
    };
  };

  a.directive('tosFadeinOnload', tosFadeinOnload);

}).call(this);

(function() {
  var a;

  a = angular.module('tos.languageResource', []);

  a.provider('$lan', function() {
    this.resource = {
      en: {
        light: 'Light',
        dark: 'Dark',
        water: 'Water',
        fire: 'Fire',
        wood: 'Wood',
        human: 'Human',
        dragon: 'Dragon',
        beast: 'Beast',
        elf: 'Elf',
        god: 'God',
        fiend: 'Fiend',
        element: 'Element',
        hp: 'HP',
        attack: 'Attack',
        recovery: 'Recovery',
        total: 'Total',
        race: 'Race',
        attribute: 'Attribute',
        cost: 'Cost',
        species: 'Species',
        rarity: 'Rarity',
        activeSkill: 'Active Skill',
        leaderSkill: 'Leader Skill',
        origin: 'Origin',
        friendPointSeal: 'Friend Point Seal',
        diamondSeal: 'Diamond Seal',
        levels: 'Levels',
        others: 'Others'
      },
      'zh-TW': {
        light: '光',
        dark: '暗',
        water: '水',
        fire: '火',
        wood: '木',
        human: '人類',
        dragon: '龍族',
        beast: '獸族',
        elf: '妖精',
        god: '神族',
        fiend: '魔族',
        element: '素材',
        hp: '生命',
        attack: '攻擊',
        recovery: '回復',
        total: '總計',
        race: '種族',
        attribute: '屬性',
        cost: '空間',
        species: '系列',
        rarity: '稀有',
        activeSkill: '主動技',
        leaderSkill: '隊長技',
        origin: '來源',
        friendPointSeal: '友情抽獎',
        diamondSeal: '魔法石抽獎',
        levels: '關卡',
        others: '其他'
      }
    };
    this.get = function() {
      return {
        resource: this.resource
      };
    };
    this.$get = this.get;
  });

}).call(this);

(function() {
  angular.module('tos', ['tos.router', 'tos.directive']);

}).call(this);

(function() {
  var a;

  a = angular.module('tos.provider', ['tos.languageResource']);

  a.provider('$tos', function() {
    var $http, $injector, $lan,
      _this = this;
    $injector = null;
    $http = null;
    $lan = null;
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
      $http = $injector.get('$http');
      return $lan = $injector.get('$lan');
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
        return $.av.pop({
          title: 'Error',
          message: 'Data loading failed.',
          template: 'error',
          mode: 'notification'
        });
      });
    };
    this.getCards = function() {
      /*
      Get all cards.
      @return: {$http}
          id: {int} The card id.
          name: {string} The card name.
          imageSm: {string} The small image url.
          race: {string} The card's race. [human, dragon, beast, elf, god, fiend, element]
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
    this.getCard = function(cardId, isForRouter) {
      var h;
      if (isForRouter == null) {
        isForRouter = false;
      }
      h = _this.getResource("data/" + _this.currentLanguage + "/cards/" + cardId + ".min.js");
      if (isForRouter) {
        return h.then(function(response) {
          return response.data;
        });
      } else {
        return h;
      }
    };
    this._ = function(key) {
      /*
      Get the language resource by the key.
      */

      var text;
      text = $lan.resource[_this.currentLanguage][key];
      if (text != null) {
        return text;
      }
      return key;
    };
    this.get = function($injector) {
      this.setupProvider($injector);
      return {
        languages: this.languages,
        currentLanguage: this.currentLanguage,
        _: this._,
        getCards: this.getCards,
        getCard: this.getCard
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
    var navigation;
    $urlRouterProvider.otherwise('/');
    navigation = {
      templateUrl: 'views/menu/navigation.html'
    };
    $stateProvider.state('index', {
      url: '/',
      resolve: {
        cards: [
          '$tos', function($tos) {
            return $tos.getCards();
          }
        ]
      },
      views: {
        nav: navigation,
        content: {
          templateUrl: 'views/content/cards.html',
          controller: 'IndexController'
        }
      }
    });
    return $stateProvider.state('card', {
      url: '/cards/:cardId',
      resolve: {
        card: [
          '$tos', '$stateParams', function($tos, $stateParams) {
            return $tos.getCard($stateParams.cardId, true);
          }
        ]
      },
      views: {
        nav: navigation,
        content: {
          templateUrl: 'views/content/card.html',
          controller: 'CardController'
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
    $rootScope.$state = $state;
    NProgress.configure({
      showSpinner: false
    });
    $rootScope.$on('$stateChangeStart', function(self, toState, toParams, fromState) {
      if (fromState.views) {
        return NProgress.start();
      }
    });
    $rootScope.$on('$stateChangeSuccess', function() {
      return NProgress.done();
    });
    return $rootScope.$on('$stateChangeError', function() {
      NProgress.done();
      $.av.pop({
        title: 'Error',
        message: 'The route loading failed.',
        template: 'error',
        mode: 'notification'
      });
      return history.back();
    });
  };

  run.inject = ['$injector'];

  a.run(run);

}).call(this);
