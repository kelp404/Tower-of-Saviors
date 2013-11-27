
a = angular.module 'tos.controller', ['tos.provider']


# ----------------------------------------
# IndexController
# ----------------------------------------
IndexController = ($scope, $injector, cards) ->
    $scope.cards = cards
    console.log cards

    $tos = $injector.get '$tos'
    $tos.getCards()

IndexController.$inject = ['$scope', '$injector', 'cards']
a.controller 'IndexController', IndexController
