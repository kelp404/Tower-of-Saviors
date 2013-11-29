
a = angular.module 'tos.controller', ['tos.provider']


# ----------------------------------------
# IndexController
# ----------------------------------------
IndexController = ($scope, $injector, cards) ->
    $scope.cards = cards

IndexController.$inject = ['$scope', '$injector', 'cards']
a.controller 'IndexController', IndexController
