
a = angular.module 'tos.provider', []

a.provider '$tos', ->
    # ----------------------------------------
    # providers
    # ----------------------------------------
    $injector = null
    $http = null


    # ----------------------------------------
    # properties
    # ----------------------------------------
    @languages =
        ###
        All language codes.
        ###
        en: 'English'
        'zh-TW': '繁體中文'
    @currentLanguage = do =>
        ###
        The current language code.
        ###
        if @languages[navigator.language]?
            navigator.language
        else
            switch navigator.language
                when 'zh-CN', 'zh-HK' then 'zh-TW'
                else 'en'


    # ----------------------------------------
    # private functions
    # ----------------------------------------
    @setupProvider = (injector) ->
        $injector = injector
        $http = $injector.get '$http'


    # ----------------------------------------
    # public functions
    # ----------------------------------------
    @getCards = =>
        ###
        Get all cards.
        @return:
            id: {int} The card id.
            name: {string} The card name.
            imageSm: {string} The small image url.
            race: {string} The card's race. [human, dragon, beast, elf, god, fiend, ee(evolve elements)]
            attribute: {string} The card's attribute. [light, dark, water, fire, wood]
        ###
        v = $http
            method: 'get'
            url: 'data/zh-TW/cards.js'
            transformResponse: [(data) ->
                result = {}
                eval "result = #{data}"
                result
            ].concat($http.defaults.transformResponse)
        v.success (data) ->
            console.log '---- success ------'
            console.log data
        []


    # ----------------------------------------
    # $get
    # ----------------------------------------
    @get = ($injector) ->
        @setupProvider $injector

        languages: @languages
        currentLanguage: @currentLanguage
        getCards: @getCards
    @get.inject = ['$injector']
    @$get = @get
    return
