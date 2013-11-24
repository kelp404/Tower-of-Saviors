(function() {
  var a;

  a = angular.module('tos.controller', ['tos.provider']);

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
  var a;

  a = angular.module('tos.router', ['tos.controller', 'ui.router']);

}).call(this);
