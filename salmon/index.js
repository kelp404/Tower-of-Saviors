(function() {
  var Salmon, salmon,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Salmon = (function() {
    function Salmon(lang, url) {
      this.lang = lang;
      this.url = url;
      this.fetchImages = __bind(this.fetchImages, this);
      if (this.lang == null) {
        this.lang = 'zh-TW';
      }
      if (this.url == null) {
        this.url = 'http://zh.tos.wikia.com/wiki/Category:%E5%9C%96%E9%91%92';
      }
      this.request = require('request');
      this.jquery = require('jquery');
      this.fs = require('fs');
    }

    Salmon.prototype.fetchImages = function() {
      var _this = this;
      this.request(this.url, function(error, response, body) {
        var $, img, src, window, _i, _len, _ref, _results;
        if (!error && response.statusCode < 300) {
          window = require('jsdom').jsdom(body, null, {
            FetchExternalResources: false,
            ProcessExternalResources: false,
            MutationEvents: false,
            QuerySelector: false
          }).createWindow();
          $ = _this.jquery.create(window);
          _ref = $('[data-image-key]');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            img = _ref[_i];
            src = $(img).attr('data-src');
            if (src == null) {
              src = $(img).attr('src');
            }
            src = src.replace(/thumb\/|\/60px-.*/g, '');
            _results.push(_this.request({
              url: src,
              encoding: null
            }, function(error, response, body) {
              var fileName;
              fileName = response.request.href.match(/^.*\/([0-9]+i\.png)$/)[1].replace('i.png', '-100.png');
              return _this.fs.writeFile("images/cards/" + fileName, body);
            }));
          }
          return _results;
        }
      });
    };

    return Salmon;

  })();

  salmon = new Salmon();

  salmon.fetchImages();

}).call(this);
