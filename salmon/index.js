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
        var $, fileName, img, index, match, src, window, _i, _results;
        if (!error && response.statusCode < 300) {
          window = require('jsdom').jsdom(body, null, {
            FetchExternalResources: false,
            ProcessExternalResources: false,
            MutationEvents: false,
            QuerySelector: false
          }).createWindow();
          $ = _this.jquery.create(window);
          _results = [];
          for (index = _i = 0; _i < 50; index = _i += 1) {
            img = $('[data-image-key]')[index];
            src = $(img).attr('data-src');
            if (src == null) {
              src = $(img).attr('src');
            }
            src = src.replace(/thumb\/|\/60px-.*/g, '');
            match = src.match(/^.*\/([0-9]+i\.png)$/);
            if (match) {
              fileName = match[1].replace('i.png', '-100.png');
              _results.push(_this.request(src).pipe(_this.fs.createWriteStream("images/cards/" + fileName)));
            } else {
              _results.push(console.error("error " + src));
            }
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
