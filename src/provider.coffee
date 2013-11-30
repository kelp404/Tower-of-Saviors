
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
            switch navigator.language.toLowerCase()
                when 'zh-tw', 'zh-cn', 'zh-hk' then 'zh-TW'
                else 'zh-TW'


    # ----------------------------------------
    # private functions
    # ----------------------------------------
    @setupProvider = (injector) ->
        $injector = injector
        $http = $injector.get '$http'

    @getResource = (url) =>
        h = $http
            method: 'get'
            url: url
            cache: yes
            transformResponse: [(data) ->
                eval data
            ].concat $http.defaults.transformResponse
        h.error ->
            console.log 'error'


    # ----------------------------------------
    # public functions
    # ----------------------------------------
    @getCards = =>
        ###
        Get all cards.
        @return: {$http}
            id: {int} The card id.
            name: {string} The card name.
            imageSm: {string} The small image url.
            race: {string} The card's race. [human, dragon, beast, elf, god, fiend, ee(evolve elements)]
            attribute: {string} The card's attribute. [light, dark, water, fire, wood]
        ###
        h = @getResource "data/#{@currentLanguage}/cards.min.js"
        h.then (response) ->
            result = []
            cards = response.data
            ids = Object.keys(cards).sort (a, b) -> a - b
            for id in ids
                cards[id].id = id
                result.push cards[id]
            result


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
