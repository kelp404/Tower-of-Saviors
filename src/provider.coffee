
a = angular.module 'tos.provider', ['tos.languageResource']

a.provider '$tos', ->
    # ----------------------------------------
    # providers
    # ----------------------------------------
    $injector = null
    $http = null
    $lan = null


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
        $lan = $injector.get '$lan'

    @getResource = (url) =>
        h = $http
            method: 'get'
            url: url
            cache: yes
            transformResponse: [(data) ->
                eval data
            ].concat $http.defaults.transformResponse
        h.error ->
            $.av.pop
                title: 'Error'
                message: 'Data loading failed.'
                template: 'error'
                mode: 'notification'


    # ----------------------------------------
    # public functions
    # ----------------------------------------
    @getCards = (flatten=no) =>
        ###
        Get all cards.
        @param flatten: yes -> return .then(), no -> return $http()
        @return flatten=no: {$http}
            id: {int} The card id.
                name: {string} The card name.
                imageSm: {string} The small image url.
                race: {string} The card's race. [human, dragon, beast, elf, god, fiend, element]
                attribute: {string} The card's attribute. [light, dark, water, fire, wood]
        @return flatten=yes: {$http}
            [id, name, imageSm, race, attribute]
        ###
        h = @getResource "data/#{@currentLanguage}/cards.min.js"
        h.then (response) ->
            cards = response.data
            if flatten
                result = []
                ids = Object.keys(cards).sort (a, b) -> a - b
                for id in ids
                    cards[id].id = id
                    result.push cards[id]
                result
            else
                cards

    @getCard = (cardId, isForRouter=no) =>
        ###
        Get the card by id.
        @param cardId: The card id.
        @param isForRouter: yes -> return .then(), no -> return $http()
        ###
        h = @getResource "data/#{@currentLanguage}/cards/#{cardId}.min.js"
        if isForRouter
            h.then (response) -> response.data
        else
            h

    @searchCards = (keywords, cards) =>
        ###
        Search cards by keywords.
        @param keywords: {array} ["keyword"]
        @param cards: {array} [{id, name, ...}]
        ###
        attributes = []
        races = []
        for keyword in keywords
            switch keyword
                when 'human', 'dragon', 'beast', 'elf', 'god', 'fiend', 'element'
                    races.push keyword
                when 'light', 'dark', 'water', 'fire', 'wood'
                    attributes.push keyword
                else
        result = []
        if attributes.length > 0 and races.length > 0
            for card in cards when card.attribute in attributes and card.race in races
                result.push card
        else if attributes.length > 0
            result.push(card) for card in cards when card.attribute in attributes
        else if races.length > 0
            result.push(card) for card in cards when card.race in races
        result

    @searchCardsBySpecies = (species, cards) =>
        ###
        Search cards by species.
        @param keywords: {string} "species"
        @param cards: {array} [{id, name, ...}]
        ###
        result = []
        for card in cards when card.species is species
            result.push card
        result

    @_ = (key) =>
        ###
        Get the language resource by the key.
        ###
        text = $lan.resource[@currentLanguage][key]
        return text if text?
        key


    # ----------------------------------------
    # $get
    # ----------------------------------------
    @get = ($injector) ->
        @setupProvider $injector

        languages: @languages
        currentLanguage: @currentLanguage
        _: @_
        getCards: @getCards
        getCard: @getCard
        searchCards: @searchCards
        searchCardsBySpecies: @searchCardsBySpecies
    @get.inject = ['$injector']
    @$get = @get
    return
