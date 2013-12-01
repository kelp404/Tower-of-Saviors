
a = angular.module 'tos.controller', ['tos.provider']


# ----------------------------------------
# IndexController
# ----------------------------------------
IndexController = ($scope, $injector, cards) ->
    # scope
    $scope.cards = cards

IndexController.$inject = ['$scope', '$injector', 'cards']
a.controller 'IndexController', IndexController


# ----------------------------------------
# CardController
# ----------------------------------------
CardController = ($scope, $injector, card) ->
    $scope.card = card

CardController.$inject = ['$scope', '$injector', 'card']
a.controller 'CardController', CardController