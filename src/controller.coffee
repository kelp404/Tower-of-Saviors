
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
    $scope.rarityArray = [0...card.rarity]

CardController.$inject = ['$scope', '$injector', 'card']
a.controller 'CardController', CardController