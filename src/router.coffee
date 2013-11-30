
a = angular.module 'tos.router', ['tos.controller', 'tos.provider', 'ui.router']


# ----------------------------------------
# config
# ----------------------------------------
config = ($stateProvider, $urlRouterProvider) ->
    $urlRouterProvider.otherwise '/'

    # ----------------------------------------
    # index
    # ----------------------------------------
    $stateProvider.state 'index',
        url: '/'
        resolve:
            cards: ['$tos', ($tos) ->
                $tos.getCards()
            ]
        views:
            content:
                templateUrl: 'views/content/cards.html'
                controller: 'IndexController'


    # ----------------------------------------
    # card details
    # ----------------------------------------
    $stateProvider.state 'card',
        url: '/cards/:cardId'
        resolve:
            card: ['$tos', '$stateParams', ($tos, $stateParams) ->
                $tos.getCard $stateParams.cardId
            ]
        views:
            content:
                templateUrl: 'views/content/card.html'
                controller: 'CardController'

config.$inject = ['$stateProvider', '$urlRouterProvider']
a.config config


# ----------------------------------------
# run
# ----------------------------------------
run = ($injector) ->
    $rootScope = $injector.get '$rootScope'
    $state = $injector.get '$state'

    $rootScope.$state = $state
run.inject = ['$injector']
a.run run
