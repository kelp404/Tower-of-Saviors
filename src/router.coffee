
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
    # providers
    $rootScope = $injector.get '$rootScope'
    $state = $injector.get '$state'

    # ui-router
    $rootScope.$state = $state

    # NProgress
    NProgress.configure showSpinner: false
    $rootScope.$on '$stateChangeStart', (self, toState, toParams, fromState) ->
        NProgress.start() if fromState.views
    $rootScope.$on '$stateChangeSuccess', ->
        NProgress.done()
    $rootScope.$on '$stateChangeError', ->
        NProgress.done()
        $.av.pop
            title: 'Error'
            message: 'The route loading failed.'
            template: 'error'
            mode: 'notification'

run.inject = ['$injector']
a.run run
