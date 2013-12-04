
a = angular.module 'tos.controller', ['tos.provider']


# ----------------------------------------
# NavigationController
# ----------------------------------------
NavigationController = ($scope, $injector) ->
    # providers
    $stateParams = $injector.get '$stateParams'
    $state = $injector.get '$state'

    # scope
    $scope.keywords = []
    if $stateParams.keywords?
        # in the search page
        for keyword in $stateParams.keywords.split ','
            keyword = keyword.trim().toLowerCase()
            $scope.keywords.push keyword if keyword isnt ''
    $scope.isActive = (link) -> link in $scope.keywords
    $scope.href = (link) ->
        if link in $scope.keywords
            keywords = (x for x in $scope.keywords when x isnt link)
            "#/search/#{keywords.join(',')}"
        else
            "#/search/#{$scope.keywords.join(',')},#{link}"

    # redirect
    if $state.current.name is 'search' and $scope.keywords.length is 0
        location.href = '#/'

NavigationController.$inject = ['$scope', '$injector']
a.controller 'NavigationController', NavigationController


# ----------------------------------------
# IndexController
# ----------------------------------------
IndexController = ($scope, cards) ->
    # scope
    $scope.cards = cards

IndexController.$inject = ['$scope', 'cards']
a.controller 'IndexController', IndexController


# ----------------------------------------
# SearchController
# ----------------------------------------
SearchController = ($scope, $injector, cards) ->
    # providers
    $stateParams = $injector.get '$stateParams'
    $tos = $injector.get '$tos'

    $stateParams.keywords ?= ''
    keywords = []
    for keyword in $stateParams.keywords.split ','
        keywords.push keyword.trim().toLowerCase()
    $scope.cards = $tos.searchCards keywords, cards

SearchController.$inject = ['$scope', '$injector', 'cards']
a.controller 'SearchController', SearchController


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
        $tos.getCard(id).success (data) -> $scope.dependencies.cards[data.id] = data
    if card.evolve.result
        $tos.getCard(card.evolve.result).success (data) -> $scope.dependencies.cards[card.evolve.result] = data

CardController.$inject = ['$scope', '$injector', 'card']
a.controller 'CardController', CardController