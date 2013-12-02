
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
    $tos = $injector.get '$tos'
    $rootScope = $injector.get '$rootScope'
    $rootScope.$state.current.resolve.title = -> "#{card.name} - "

    $scope.card = card
    $scope.rarityArray = [0...card.rarity]

    # fetch dependencies
    $scope.dependencies =
        cards: {}
    if card.evolve.origin
        $tos.getCard(card.evolve.origin).success (data) -> $scope.dependencies.cards[card.evolve.origin] = data
    for id in card.evolve.resources
        $tos.getCard(id).success (data) -> $scope.dependencies.cards[id] = data
    if card.evolve.result
        $tos.getCard(card.evolve.result).success (data) -> $scope.dependencies.cards[card.evolve.result] = data

CardController.$inject = ['$scope', '$injector', 'card']
a.controller 'CardController', CardController