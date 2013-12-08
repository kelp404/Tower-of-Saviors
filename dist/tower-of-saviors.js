(function() {
  var CardController, IndexController, NavigationController, SearchController, a,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  a = angular.module('tos.controller', ['tos.provider']);

  NavigationController = function($scope, $injector) {
    var $state, $stateParams, keyword, _i, _len, _ref;
    $stateParams = $injector.get('$stateParams');
    $state = $injector.get('$state');
    $scope.keywords = [];
    if ($stateParams.keywords != null) {
      _ref = $stateParams.keywords.split(',');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        keyword = _ref[_i];
        keyword = keyword.trim().toLowerCase();
        if (keyword !== '') {
          $scope.keywords.push(keyword);
        }
      }
    }
    $scope.isActive = function(link) {
      return __indexOf.call($scope.keywords, link) >= 0;
    };
    $scope.href = function(link) {
      var keywords, x;
      if (__indexOf.call($scope.keywords, link) >= 0) {
        keywords = (function() {
          var _j, _len1, _ref1, _results;
          _ref1 = $scope.keywords;
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            x = _ref1[_j];
            if (x !== link) {
              _results.push(x);
            }
          }
          return _results;
        })();
        return "#/search/" + (keywords.join(','));
      } else {
        return "#/search/" + ($scope.keywords.join(',')) + "," + link;
      }
    };
    if ($state.current.name === 'search' && $scope.keywords.length === 0) {
      return location.href = '#/';
    }
  };

  NavigationController.$inject = ['$scope', '$injector'];

  a.controller('NavigationController', NavigationController);

  IndexController = function($scope, cards) {
    return $scope.cards = cards;
  };

  IndexController.$inject = ['$scope', 'cards'];

  a.controller('IndexController', IndexController);

  SearchController = function($scope, $injector, cards) {
    var $stateParams, $tos, keyword, keywords, _i, _len, _ref;
    $stateParams = $injector.get('$stateParams');
    $tos = $injector.get('$tos');
    if ($stateParams.keywords == null) {
      $stateParams.keywords = '';
    }
    keywords = [];
    _ref = $stateParams.keywords.split(',');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      keyword = _ref[_i];
      keywords.push(keyword.trim().toLowerCase());
    }
    return $scope.cards = $tos.searchCards(keywords, cards);
  };

  SearchController.$inject = ['$scope', '$injector', 'cards'];

  a.controller('SearchController', SearchController);

  CardController = function($scope, $injector, card, cards) {
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
      $scope.dependencies.cards[card.evolve.origin] = cards[card.evolve.origin];
    }
    _ref1 = card.evolve.resources;
    for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
      id = _ref1[_j];
      $scope.dependencies.cards[id] = cards[id];
    }
    if (card.evolve.result) {
      return $scope.dependencies.cards[card.evolve.result] = cards[card.evolve.result];
    }
  };

  CardController.$inject = ['$scope', '$injector', 'card', 'cards'];

  a.controller('CardController', CardController);

}).call(this);

(function() {
  var a, tosFadeinOnload, tosGotoTop, tosLang;

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

  tosGotoTop = function() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        return element.click(function() {
          $('html, body').animate({
            scrollTop: 0
          }, 300);
          return false;
        });
      }
    };
  };

  a.directive('tosGotoTop', tosGotoTop);

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
        others: 'Others',
        main: 'Main Character',
        chineseBeast: 'Chinese Beast',
        defensiveDragon: 'Defensive Dragon',
        gnome: 'Gnome',
        salamander: 'Salamander',
        witch: 'Witch',
        slime: 'Slime',
        wolf: 'Wolf',
        moiraSister: 'Moirai Sister',
        paladin: 'Paladin',
        colossus: 'Colossus',
        metallicBeast: 'Metallic Beast',
        cthulhuBeast: 'Cthulhu Beast',
        greekGod: 'Greek Gods',
        northernEuropeanGod: 'Northern European God',
        egyptianGod: 'Egyptian God',
        journeyWestGod: 'Journey West God',
        metallicDragon: 'Metallic Dragon',
        evolveElements: 'Evolve Elements',
        soulStone: 'soulStone',
        boss: 'Special Boss',
        fairy: 'Fairy',
        stone: 'Stone',
        hex: 'Hex',
        catDuke: 'Cat Duke',
        constellation: 'Constellation',
        star: 'Star',
        clown: 'Clown',
        undead: 'Undead',
        greekBeast: 'Greek Beast',
        dragonEnvoy: 'Dragon Envoy',
        duck: 'B.Duck',
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
        others: '其他',
        main: '主角',
        chineseBeast: '中國神獸',
        defensiveDragon: '防龍',
        gnome: '地精',
        salamander: '蜥蜴',
        witch: '魔女',
        slime: '史萊姆',
        wolf: '狼人',
        moiraSister: '命運女神',
        paladin: '遊俠',
        colossus: '巨像',
        metallicBeast: '機械獸',
        cthulhuBeast: '西方獸',
        greekGod: '希臘神',
        northernEuropeanGod: '北歐神',
        egyptianGod: '埃及神',
        journeyWestGod: '西遊神',
        metallicDragon: '機械龍',
        evolveElements: '素材',
        soulStone: '靈魂石',
        boss: '封王',
        fairy: '妖女',
        stone: '石像',
        hex: '巫女',
        catDuke: '貓公爵系列',
        constellation: '黃道十二宮',
        star: '星靈',
        clown: '小丑',
        undead: '不死魔族',
        greekBeast: '希臘妖獸',
        dragonEnvoy: '龍使',
        duck: 'B.Duck',
        others: '未歸類'
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
  var a,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
    this.getCards = function(flatten) {
      var h;
      if (flatten == null) {
        flatten = false;
      }
      /*
      Get all cards.
      @param flatten: yes -> return .then(), no -> return $http()
      @return flatten=no: {$http}
          id: {int} The card id.
              name: {string} The card name.
              imageSm: {string} The small image url.
              race: {string} The card's race. [human, dragon, beast, elf, god, fiend, element]
              attribute: {string} The card's attribute. [light, dark, water, fire, wood]
      @return flatten=yes: {$http}
          [id, name, imageSm, race, attribute]
      */

      h = _this.getResource("data/" + _this.currentLanguage + "/cards.min.js");
      return h.then(function(response) {
        var cards, id, ids, result, _i, _len;
        cards = response.data;
        if (flatten) {
          result = [];
          ids = Object.keys(cards).sort(function(a, b) {
            return a - b;
          });
          for (_i = 0, _len = ids.length; _i < _len; _i++) {
            id = ids[_i];
            cards[id].id = id;
            result.push(cards[id]);
          }
          return result;
        } else {
          return cards;
        }
      });
    };
    this.getCard = function(cardId, isForRouter) {
      var h;
      if (isForRouter == null) {
        isForRouter = false;
      }
      /*
      Get the card by id.
      @param cardId: The card id.
      @param isForRouter: yes -> return .then(), no -> return $http()
      */

      h = _this.getResource("data/" + _this.currentLanguage + "/cards/" + cardId + ".min.js");
      if (isForRouter) {
        return h.then(function(response) {
          return response.data;
        });
      } else {
        return h;
      }
    };
    this.searchCards = function(keywords, cards) {
      /*
      Search cards by keywords.
      @param keywords: {array} ["keyword"]
      @param cards: {array} [{id, name, ...}]
      */

      var attributes, card, keyword, races, result, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
      attributes = [];
      races = [];
      for (_i = 0, _len = keywords.length; _i < _len; _i++) {
        keyword = keywords[_i];
        switch (keyword) {
          case 'human':
          case 'dragon':
          case 'beast':
          case 'elf':
          case 'god':
          case 'fiend':
          case 'element':
            races.push(keyword);
            break;
          case 'light':
          case 'dark':
          case 'water':
          case 'fire':
          case 'wood':
            attributes.push(keyword);
            break;
        }
      }
      result = [];
      if (attributes.length > 0 && races.length > 0) {
        for (_j = 0, _len1 = cards.length; _j < _len1; _j++) {
          card = cards[_j];
          if ((_ref = card.attribute, __indexOf.call(attributes, _ref) >= 0) && (_ref1 = card.race, __indexOf.call(races, _ref1) >= 0)) {
            result.push(card);
          }
        }
      } else if (attributes.length > 0) {
        for (_k = 0, _len2 = cards.length; _k < _len2; _k++) {
          card = cards[_k];
          if (_ref2 = card.attribute, __indexOf.call(attributes, _ref2) >= 0) {
            result.push(card);
          }
        }
      } else if (races.length > 0) {
        for (_l = 0, _len3 = cards.length; _l < _len3; _l++) {
          card = cards[_l];
          if (_ref3 = card.race, __indexOf.call(races, _ref3) >= 0) {
            result.push(card);
          }
        }
      }
      return result;
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
        getCard: this.getCard,
        searchCards: this.searchCards
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
      templateUrl: 'views/menu/navigation.html',
      controller: 'NavigationController'
    };
    $stateProvider.state('index', {
      url: '/',
      resolve: {
        cards: [
          '$tos', function($tos) {
            return $tos.getCards(true);
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
    $stateProvider.state('search', {
      url: '/search/:keywords',
      resolve: {
        cards: [
          '$tos', function($tos) {
            return $tos.getCards(true);
          }
        ]
      },
      views: {
        nav: navigation,
        content: {
          templateUrl: 'views/content/cards.html',
          controller: 'SearchController'
        }
      }
    });
    return $stateProvider.state('card', {
      url: '/cards/:cardId',
      resolve: {
        cards: [
          '$tos', function($tos) {
            return $tos.getCards();
          }
        ],
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
    var $rootScope, $state, status;
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    $rootScope.$state = $state;
    NProgress.configure({
      showSpinner: false
    });
    status = {
      pool: [],
      lastHash: location.hash,
      rollbackTop: null
    };
    $rootScope.$on('$stateChangeStart', function(self, toState, toParams, fromState) {
      var item;
      if (fromState.views) {
        NProgress.start();
      }
      if (status.pool.length > 0) {
        item = status.pool.pop();
        if (item.hash === location.hash) {
          status.rollbackTop = item.scrollTop;
          status.lastHash = location.hash;
          return;
        } else {
          status.rollbackTop = null;
          status.pool.push(item);
        }
      }
      status.pool.push({
        hash: status.lastHash,
        scrollTop: $(window).scrollTop()
      });
      return status.lastHash = location.hash;
    });
    $rootScope.$on('$stateChangeSuccess', function() {
      if (status.rollbackTop != null) {
        setTimeout(function() {
          return $('html, body').animate({
            scrollTop: status.rollbackTop
          }, 200);
        }, 100);
      }
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
