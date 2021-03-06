(function() {
  var Salmon, salmon,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Salmon = (function() {
    function Salmon(lang, url) {
      this.lang = lang;
      this.url = url;
      this.fetchLocalData = __bind(this.fetchLocalData, this);
      this.updateData = __bind(this.updateData, this);
      this.writeCardCoffee = __bind(this.writeCardCoffee, this);
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
      return this.request(this.url, (function(_this) {
        return function(error, response, body) {
          if (!error && response.statusCode < 300) {
            return func(error, response, body);
          } else {
            return console.error("fetch '" + _this.url + "' failed.");
          }
        };
      })(this));
    };

    Salmon.prototype.setupJquery = function(body) {
      var window;
      window = this.jsdom.jsdom(body, null, {
        FetchExternalResources: false,
        ProcessExternalResources: false,
        MutationEvents: false,
        QuerySelector: false
      }).createWindow();
      return this.jquery(window);
    };

    Salmon.prototype.fetchIcons = function(start, end) {
      return this.fetchIndex((function(_this) {
        return function(error, response, body) {
          var $, fileName, images, img, index, src, _i, _results;
          $ = _this.setupJquery(body);
          images = $('[data-image-key]');
          if (end == null) {
            end = images.length - 1;
          }
          if (end >= images.length) {
            end = images.length - 1;
          }
          _results = [];
          for (index = _i = start; _i <= end; index = _i += 1) {
            img = images[index];
            src = $(img).attr('data-src');
            if (src == null) {
              src = $(img).attr('src');
            }
            src = src.replace(/thumb\/|\/60px-.*/g, '');
            fileName = src.match(/^.*\/([0-9]+i\.png)$/)[1].replace('i.png', '.png');
            _results.push(_this.fetchImage(src, "100/" + fileName));
          }
          return _results;
        };
      })(this));
    };

    Salmon.prototype.fetchImage = function(url, fileName) {
      return this.request({
        url: url,
        encoding: null
      }, (function(_this) {
        return function(error, response, body) {
          return _this.fs.writeFile("images/cards/" + fileName, body);
        };
      })(this));
    };

    Salmon.prototype.fetchCards = function(start, end) {
      var cards;
      cards = {};
      return this.fetchIndex((function(_this) {
        return function(error, response, body) {
          var $, index, link, total, _i, _results;
          $ = _this.setupJquery(body);
          total = $('#mw-content-text a').length;
          if (end == null) {
            end = total - 1;
          }
          if (end >= total) {
            end = total - 1;
          }
          _results = [];
          for (index = _i = start; _i <= end; index = _i += 1) {
            link = $('#mw-content-text a')[index];
            _results.push(_this.fetchCard("" + _this.origin + ($(link).attr('href')), cards, end - start + 1));
          }
          return _results;
        };
      })(this));
    };

    Salmon.prototype.fetchCard = function(url, pool, total) {
      return this.request(url, (function(_this) {
        return function(error, response, body) {
          var $, activeSkill, attribute, cost, evolve, id, leaderSkill, name, origin, properties, race, rarity, species;
          $ = _this.setupJquery(body);
          id = $($('.wikitable tr')[1]).find('td:first').text().trim();
          name = $($($('.wikitable tr')[0]).find('td')[1]).text().trim();
          race = _this.bleachRace($($($('.wikitable tr')[1]).find('td')[3]).text().trim());
          attribute = _this.bleachAttribute($($($('.wikitable tr')[0]).find('td')[2]).text().trim());
          if (race === 'error' || attribute === 'error') {
            console.log("======= error ======= " + id);
          }
          species = $($($('.wikitable tr')[1]).find('td')[4]).text().trim();
          rarity = parseInt($($($('.wikitable tr')[1]).find('td')[1]).text());
          cost = parseInt($($($('.wikitable tr')[1]).find('td')[2]).text());
          properties = {
            lvMin: {
              lv: 1,
              hp: parseInt($($($('.wikitable tr')[4]).find('td')[0]).text()),
              attack: parseInt($($($('.wikitable tr')[4]).find('td')[1]).text()),
              recovery: parseInt($($($('.wikitable tr')[4]).find('td')[2]).text()),
              total: parseInt($($($('.wikitable tr')[4]).find('td')[3]).text())
            },
            lvMax: {
              lv: parseInt($($($('.wikitable tr')[2]).find('td')[0]).text()),
              hp: parseInt($($($('.wikitable tr')[5]).find('td')[0]).text()),
              attack: parseInt($($($('.wikitable tr')[5]).find('td')[1]).text()),
              recovery: parseInt($($($('.wikitable tr')[5]).find('td')[2]).text()),
              total: parseInt($($($('.wikitable tr')[5]).find('td')[3]).text())
            }
          };
          activeSkill = {
            name: $($($('.wikitable tr')[6]).find('td')[1]).text().trim(),
            description: $($($('.wikitable tr')[7]).find('td')[0]).text().trim(),
            cd: {
              ori: $($($('.wikitable tr')[6]).find('td')[2]).text().trim(),
              min: $($($('.wikitable tr')[6]).find('td')[3]).text().trim()
            }
          };
          leaderSkill = {
            name: $($($('.wikitable tr')[8]).find('td')[1]).text().trim(),
            description: $($($('.wikitable tr')[9]).find('td')[0]).text().trim()
          };
          evolve = {
            origin: null,
            resources: [],
            result: null
          };
          origin = {
            friendPointSeal: false,
            diamondSeal: false,
            others: [],
            levels: []
          };
          if (race === 'element') {
            origin.friendPointSeal = $($($('.wikitable tr')[10]).find('td')[1]).text().trim() === '有';
            origin.diamondSeal = $($($('.wikitable tr')[10]).find('td')[2]).text().trim() === '有';
            origin.others = (function() {
              var links, x, _i, _len, _results;
              links = $($($('.wikitable tr')[10]).find('td')[3]).find('a');
              if (links.length === 0) {
                return [];
              }
              _results = [];
              for (_i = 0, _len = links.length; _i < _len; _i++) {
                x = links[_i];
                _results.push($(x).text().trim());
              }
              return _results;
            })();
            origin.levels = (function() {
              var links, x, _i, _len, _results;
              links = $($($('.wikitable tr')[11]).find('td')[0]).find('a');
              if (links.length === 0) {
                return [];
              }
              _results = [];
              for (_i = 0, _len = links.length; _i < _len; _i++) {
                x = links[_i];
                _results.push($(x).text().trim());
              }
              return _results;
            })();
          } else {
            origin.friendPointSeal = $($($('.wikitable tr')[11]).find('td')[1]).text().trim() === '有';
            origin.diamondSeal = $($($('.wikitable tr')[11]).find('td')[2]).text().trim() === '有';
            origin.others = (function() {
              var links, x, _i, _len, _results;
              links = $($($('.wikitable tr')[11]).find('td')[3]).find('a');
              if (links.length === 0) {
                return [];
              }
              _results = [];
              for (_i = 0, _len = links.length; _i < _len; _i++) {
                x = links[_i];
                _results.push($(x).text().trim());
              }
              return _results;
            })();
            origin.levels = (function() {
              var links, x, _i, _len, _results;
              links = $($($('.wikitable tr')[12]).find('td')[0]).find('a');
              if (links.length === 0) {
                return [];
              }
              _results = [];
              for (_i = 0, _len = links.length; _i < _len; _i++) {
                x = links[_i];
                _results.push($(x).text().trim());
              }
              return _results;
            })();
          }
          pool[id] = {
            id: id,
            name: name,
            imageSm: "images/cards/100/" + id + ".png",
            imageMd: "images/cards/600/" + id + ".png",
            race: race,
            attribute: attribute,
            species: species,
            rarity: rarity,
            cost: cost,
            properties: properties,
            activeSkill: activeSkill,
            leaderSkill: leaderSkill,
            evolve: evolve,
            origin: origin
          };
          _this.writeCardCoffee(pool[id]);
          _this.fetchImage($('#mw-content-text img:first').attr('src'), "600/" + id + ".png");
          if (Object.keys(pool).length === total) {
            return _this.writeCardsCoffee(pool);
          }
        };
      })(this));
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

    Salmon.prototype.writeCardCoffee = function(card) {
      var coffee, originLevels, originOthers;
      originOthers = '';
      if (card.origin.others.length > 0) {
        originOthers = "'" + (card.origin.others.join('\', \'')) + "'";
      }
      originLevels = '';
      if (card.origin.levels.length > 0) {
        originLevels = "'" + (card.origin.levels.join('\', \'')) + "'";
      }
      coffee = "id: " + (card.id * 1) + "\nname: '" + card.name + "'\nimageSm: '" + card.imageSm + "'\nimageMd: '" + card.imageMd + "'\nrace: '" + card.race + "'\nattribute: '" + card.attribute + "'\nspecies: '" + card.species + "'\nrarity: " + card.rarity + "\ncost: " + card.cost + "\nproperties:\n    lvMin:\n        lv: " + card.properties.lvMin.lv + "\n        hp: " + card.properties.lvMin.hp + "\n        attack: " + card.properties.lvMin.attack + "\n        recovery: " + card.properties.lvMin.recovery + "\n        total: " + card.properties.lvMin.total + "\n    lvMax:\n        lv: " + card.properties.lvMax.lv + "\n        hp: " + card.properties.lvMax.hp + "\n        attack: " + card.properties.lvMax.attack + "\n        recovery: " + card.properties.lvMax.recovery + "\n        total: " + card.properties.lvMax.total + "\nactiveSkill:\n    name: '" + card.activeSkill.name + "'\n    description: '" + card.activeSkill.description + "'\n    cd:\n        ori: " + card.activeSkill.cd.ori + "\n        min: " + card.activeSkill.cd.min + "\nleaderSkill:\n    name: '" + card.leaderSkill.name + "'\n    description: '" + card.leaderSkill.description + "'\nevolve:\n    origin: " + card.evolve.origin + "\n    resources: [" + (card.evolve.resources.join(', ')) + "]\n    result: " + card.evolve.result + "\norigin:\n    friendPointSeal: " + (card.origin.friendPointSeal ? 'yes' : 'no') + "\n    diamondSeal: " + (card.origin.diamondSeal ? 'yes' : 'no') + "\n    others: [" + originOthers + "]\n    levels: [" + originLevels + "]";
      return this.fs.writeFile("data/" + this.lang + "/cards/_source/" + (card.id * 1) + ".coffee", coffee);
    };

    Salmon.prototype.updateData = function() {
      var id, pool, total, _i, _results;
      total = 448;
      pool = {};
      _results = [];
      for (id = _i = 1; _i <= 448; id = ++_i) {
        _results.push(this.fetchLocalData(id, pool, total));
      }
      return _results;
    };

    Salmon.prototype.fetchLocalData = function(cardId, pool, total) {
      return this.request("" + this.url + "/" + cardId + ".min.js", (function(_this) {
        return function(error, response, body) {
          var card, coffee, id, ids, _i, _len;
          if (!error && response.statusCode < 300) {
            pool[cardId] = eval(body);
            pool[cardId].species = _this.bleachSpecies(pool[cardId].species);
          } else {
            pool[cardId] = {
              name: null,
              imageSm: 'images/cards/100/000.png',
              race: null,
              attribute: null,
              species: null
            };
          }
          if (Object.keys(pool).length === total) {
            console.log('done');
            coffee = '';
            ids = Object.keys(pool).sort(function(a, b) {
              return a - b;
            });
            for (_i = 0, _len = ids.length; _i < _len; _i++) {
              id = ids[_i];
              card = pool[id];
              coffee += "" + id + ":\n    name: '" + card.name + "'\n    imageSm: '" + card.imageSm + "'\n    race: '" + card.race + "'\n    attribute: '" + card.attribute + "'\n    species: '" + card.species + "'\n";
            }
            return _this.fs.writeFile("data/" + _this.lang + "/cards.coffee", coffee);
          }
        };
      })(this));
    };

    Salmon.prototype.bleachSpecies = function(source) {
      var species;
      species = source;
      switch (source) {
        case '主角':
        case 'Main Character':
          species = 'main';
          break;
        case '中國神獸':
        case 'Chinese Beast':
          species = 'chineseBeast';
          break;
        case '防龍':
        case 'Defensive Dragon':
          species = 'defensiveDragon';
          break;
        case '地精':
        case 'Gnome':
          species = 'gnome';
          break;
        case '精靈':
        case 'Elf':
          species = 'elf';
          break;
        case '蜥蜴':
        case 'Salamander':
          species = 'salamander';
          break;
        case '魔女':
        case 'Witch':
          species = 'witch';
          break;
        case '史萊姆':
        case 'Slime':
          species = 'slime';
          break;
        case '狼人':
        case 'Wolf':
          species = 'wolf';
          break;
        case '命運女神':
        case 'Moirai Sister':
          species = 'moiraSister';
          break;
        case '遊俠':
        case 'Paladin':
          species = 'paladin';
          break;
        case '巨像':
          species = 'colossus';
          break;
        case '機械獸':
        case 'Metallic Beast':
          species = 'metallicBeast';
          break;
        case '西方獸':
        case 'Cthulhu Beast':
          species = 'cthulhuBeast';
          break;
        case '希臘神':
        case 'Greek Gods':
          species = 'greekGod';
          break;
        case '北歐神':
        case 'Northern European God':
          species = 'northernEuropeanGod';
          break;
        case '埃及神':
        case 'Egyptian God':
          species = 'egyptianGod';
          break;
        case '西遊神':
        case 'Journey West God':
          species = 'journeyWestGod';
          break;
        case '機械龍':
        case 'Metallic Dragon':
          species = 'metallicDragon';
          break;
        case '元素':
        case 'Evolve Elements':
        case '進化素材':
        case 'Special Evolve Elements':
          species = 'evolveElements';
          break;
        case '靈魂石':
        case 'LevelUp Elements':
          species = 'soulStone';
          break;
        case '封王':
        case 'Special Boss':
          species = 'boss';
          break;
        case '妖女':
        case 'Fairy':
          species = 'fairy';
          break;
        case '異界龍':
        case 'Cthulhu Dragon':
          species = 'cthulhuDragon';
          break;
        case '石像':
        case 'Stone':
          species = 'stone';
          break;
        case '巫女':
        case 'Hex':
          species = 'hex';
          break;
        case '貓公爵系列':
        case 'Cat Duke':
          species = 'catDuke';
          break;
        case '黃道十二宮':
        case 'Constellation':
          species = 'constellation';
          break;
        case '星靈':
        case 'Star':
          species = 'star';
          break;
        case '小丑':
        case 'Clown':
          species = 'clown';
          break;
        case '不死魔族':
        case 'Undead':
          species = 'Undead';
          break;
        case '希臘妖獸':
        case 'Greek Beast':
          species = 'Greek Beast';
          break;
        case '龍使':
        case 'Dragon Envoy':
          species = 'dragonEnvoy';
          break;
        case 'B.Duck':
          species = 'duck';
          break;
        default:
          console.log(species);
          species = 'error';
      }
      return species;
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
          console.log(race);
          race = 'error';
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
          console.log(attribute);
          attribute = 'error';
      }
      return attribute;
    };

    return Salmon;

  })();

  salmon = new Salmon('zh-TW');

  salmon.fetchIcons(0, 100);

}).call(this);
