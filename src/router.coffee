
a = angular.module 'tos.router', ['tos.controller', 'tos.provider', 'ui.router']


# ----------------------------------------
# config
# ----------------------------------------
config = ($stateProvider, $urlRouterProvider) ->
    $urlRouterProvider.otherwise '/'

    navigation =
        templateUrl: 'views/menu/navigation.html'
        controller: 'NavigationController'

    # ----------------------------------------
    # index
    # ----------------------------------------
    $stateProvider.state 'index',
        url: '/'
        resolve:
            cards: ['$tos', ($tos) ->
                $tos.getCards yes
            ]
        views:
            nav: navigation
            content:
                templateUrl: 'views/content/cards.html'
                controller: 'IndexController'

    # ----------------------------------------
    # search
    # ----------------------------------------
    $stateProvider.state 'search',
        url: '/search/:keywords'
        resolve:
            cards: ['$tos', ($tos) ->
                $tos.getCards yes
            ]
        views:
            nav: navigation
            content:
                templateUrl: 'views/content/cards.html'
                controller: 'SearchController'

    # ----------------------------------------
    # species
    # ----------------------------------------
    $stateProvider.state 'species',
        url: '/species/:species'
        resolve:
            cards: ['$tos', ($tos) ->
                $tos.getCards yes
            ]
        views:
            nav: navigation
            content:
                templateUrl: 'views/content/cards.html'
                controller: 'SearchController'

    # ----------------------------------------
    # card details
    # ----------------------------------------
    $stateProvider.state 'card',
        url: '/cards/:cardId'
        resolve:
            cards: ['$tos', ($tos) ->
                $tos.getCards()
            ]
            card: ['$tos', '$stateParams', ($tos, $stateParams) ->
                $tos.getCard $stateParams.cardId, yes
            ]
        views:
            nav: navigation
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

    # state changed
    status =
        pool: []
        lastHash: location.hash
        rollbackTop: null
    $rootScope.$on '$stateChangeStart', (self, toState, toParams, fromState) ->
        NProgress.start() if fromState.views
        if status.pool.length > 0
            item = status.pool.pop()
            if item.hash is location.hash
                # back()
                status.rollbackTop = item.scrollTop
                status.lastHash = location.hash
                return
            else    # go()
                status.rollbackTop = null
                status.pool.push item
        status.pool.push
            hash: status.lastHash
            scrollTop: $(window).scrollTop()
        status.lastHash = location.hash
    $rootScope.$on '$stateChangeSuccess', ->
        if status.rollbackTop?
            setTimeout ->
                $('html, body').animate scrollTop: status.rollbackTop, 200
            , 100
        NProgress.done()
    $rootScope.$on '$stateChangeError', ->
        NProgress.done()
        $.av.pop
            title: 'Error'
            message: 'The route loading failed.'
            template: 'error'
            mode: 'notification'
        history.back()

run.inject = ['$injector']
a.run run
