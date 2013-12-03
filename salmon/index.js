(function() {
  var Salmon, salmon,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Salmon = (function() {
    function Salmon(lang, url) {
      this.lang = lang;
      this.url = url;
      this.writeCardsCoffee = __bind(this.writeCardsCoffee, this);
      this.fetchCard = __bind(this.fetchCard, this);
      this.fetchCards = __bind(this.fetchCards, this);
      this.fetchImage = __bind(this.fetchImage, this);
      this.fetchIcons = __bind(this.fetchIcons, this);
      this.setupJquery = __bind(this.setupJquery, this);
      this.fetchIndex = __bind(this.fetchIndex, this);
      if (this.lang == null) {
        this.lang = 'zh-TW';
      }
      if (this.url == null) {
        this.url = 'http://zh.tos.wikia.com/wiki/Category:%E5%9C%96%E9%91%92';
      }
      this.origin = this.url.match(/^(.*\/\/(\w|\.)+).*$/)[1];
      this.request = require('request');
      this.jquery = require('jquery');
      this.fs = require('fs');
      this.jsdom = require('jsdom');
    }

    Salmon.prototype.fetchIndex = function(func) {
      var _this = this;
      return this.request(this.url, function(error, response, body) {
        if (!error && response.statusCode < 300) {
          return func(error, response, body);
        } else {
          return console.error("fetch '" + _this.url + "' failed.");
        }
      });
    };

    Salmon.prototype.setupJquery = function(body) {
      var window;
      window = this.jsdom.jsdom(body, null, {
        FetchExternalResources: false,
        ProcessExternalResources: false,
        MutationEvents: false,
        QuerySelector: false
      }).createWindow();
      return this.jquery.create(window);
    };

    Salmon.prototype.fetchIcons = function() {
      var _this = this;
      return this.fetchIndex(function(error, response, body) {
        var $, fileName, img, src, _i, _len, _ref, _results;
        $ = _this.setupJquery(body);
        _ref = $('[data-image-key]');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          img = _ref[_i];
          src = $(img).attr('data-src');
          if (src == null) {
            src = $(img).attr('src');
          }
          src = src.replace(/thumb\/|\/60px-.*/g, '');
          fileName = src.match(/^.*\/([0-9]+i\.png)$/)[1].replace('i.png', '.png');
          _results.push(_this.fetchImage(src, "100/" + fileName));
        }
        return _results;
      });
    };

    Salmon.prototype.fetchImage = function(url, fileName) {
      var _this = this;
      return this.request({
        url: url,
        encoding: null
      }, function(error, response, body) {
        return _this.fs.writeFile("images/cards/" + fileName, body);
      });
    };

    Salmon.prototype.fetchCards = function(start, end) {
      var cards,
        _this = this;
      cards = {};
      return this.fetchIndex(function(error, response, body) {
        var $, index, link, total, _i, _results;
        $ = _this.setupJquery(body);
        total = $('#mw-content-text a').length;
        _results = [];
        for (index = _i = start; _i <= end; index = _i += 1) {
          if (!(index < total)) {
            continue;
          }
          link = $('#mw-content-text a')[index];
          _results.push(_this.fetchCard("" + _this.origin + ($(link).attr('href')), cards, end - start + 1));
        }
        return _results;
      });
    };

    Salmon.prototype.fetchCard = function(url, pool, total) {
      var _this = this;
      return this.request(url, function(error, response, body) {
        var $, attribute, id, name, race;
        $ = _this.setupJquery(body);
        id = $($('.wikitable tr')[1]).find('td:first').text().trim();
        name = $($($('.wikitable tr')[0]).find('td')[1]).text().trim();
        race = $($($('.wikitable tr')[1]).find('td')[3]).text().trim();
        attribute = $($($('.wikitable tr')[0]).find('td')[2]).text().trim();
        pool[id] = {
          name: name,
          imageSm: "images/cards/100/" + id + ".png",
          race: _this.bleachRace(race),
          attribute: _this.bleachAttribute(attribute)
        };
        if (Object.keys(pool).length === total) {
          return _this.writeCardsCoffee(pool);
        }
      });
    };

    Salmon.prototype.writeCardsCoffee = function(cards) {
      var card, coffee, id, ids, _i, _len;
      coffee = '';
      ids = Object.keys(cards).sort();
      for (_i = 0, _len = ids.length; _i < _len; _i++) {
        id = ids[_i];
        card = cards[id];
        coffee += "" + (id * 1) + ":\n    name: '" + card.name + "'\n    imageSm: '" + card.imageSm + "'\n    race: '" + card.race + "'\n    attribute: '" + card.attribute + "'\n";
      }
      this.fs.writeFile("data/" + this.lang + "/cards.coffee", coffee);
      return console.log("written " + (Object.keys(cards).length) + " items.");
    };

    Salmon.prototype.bleachRace = function(source) {
      var race;
      race = source;
      switch (source.toLowerCase()) {
        case 'human':
        case '人類':
          race = 'human';
          break;
        case 'dragon':
        case '龍族':
        case '龍類':
          race = 'dragon';
          break;
        case 'beast':
        case '獸族':
        case '獸類':
          race = 'beast';
          break;
        case 'elf':
        case '妖精':
        case '妖精類':
          race = 'elf';
          break;
        case 'god':
        case '神族':
          race = 'god';
          break;
        case 'fiend':
        case '魔族':
          race = 'fiend';
          break;
        case '強化素材':
        case '進化素材':
          race = 'element';
          break;
        default:
          console.error("bleach race failed: " + race);
      }
      return race;
    };

    Salmon.prototype.bleachAttribute = function(source) {
      var attribute;
      attribute = source;
      switch (source.toLowerCase()) {
        case 'light':
        case '光':
          attribute = 'light';
          break;
        case 'dark':
        case '暗':
          attribute = 'dark';
          break;
        case 'water':
        case '水':
          attribute = 'water';
          break;
        case 'fire':
        case '火':
          attribute = 'fire';
          break;
        case 'wood':
        case '木':
          attribute = 'wood';
          break;
        default:
          console.error("bleach attribute failed: " + source);
      }
      return attribute;
    };

    return Salmon;

  })();

  salmon = new Salmon();

  salmon.fetchCards(0, 50);

}).call(this);
