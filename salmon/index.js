(function() {
  var Salmon, salmon,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Salmon = (function() {
    function Salmon(lang, url) {
      this.lang = lang;
      this.url = url;
      this.fetchCards = __bind(this.fetchCards, this);
      this.fetchIcon = __bind(this.fetchIcon, this);
      this.fetchIcons = __bind(this.fetchIcons, this);
      this.setupJquery = __bind(this.setupJquery, this);
      this.fetchIndex = __bind(this.fetchIndex, this);
      if (this.lang == null) {
        this.lang = 'zh-TW';
      }
      if (this.url == null) {
        this.url = 'http://zh.tos.wikia.com/wiki/Category:%E5%9C%96%E9%91%92';
      }
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
          fileName = src.match(/^.*\/([0-9]+i\.png)$/)[1].replace('i.png', '-100.png');
          _results.push(_this.fetchIcon(src, fileName));
        }
        return _results;
      });
    };

    Salmon.prototype.fetchIcon = function(src, fileName) {
      var _this = this;
      return this.request({
        url: src,
        encoding: null
      }, function(error, response, body) {
        return _this.fs.writeFile("images/cards/" + fileName, body);
      });
    };

    Salmon.prototype.fetchCards = function() {
      var _this = this;
      return this.fetchIndex(function(error, response, body) {
        var $;
        $ = _this.setupJquery(body);
        return $('#mw-content-text').find('a');
      });
    };

    return Salmon;

  })();

  salmon = new Salmon();

  salmon.fetchIcons();

}).call(this);
