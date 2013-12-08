describe 'tos.provider', ->
    fakeModule = null
    tosProvider = null

    beforeEach module('tos')
    beforeEach ->
        # mock NProgress
        window.NProgress =
            configure: ->
        # fack module
        fakeModule = angular.module 'fakeModule', ['tos']
        fakeModule.config ($tosProvider) ->
            tosProvider = $tosProvider
    beforeEach module('fakeModule')


    describe '$tos.languages', ->
        it 'default values of $tos.languages', inject ($tos) ->
            expect
                en: 'English'
                'zh-TW': '繁體中文'
            .toEqual $tos.languages

    describe '$tos.currentLanguage', ->
        it '$tos.currentLanguage is equal to `zh-TW`', inject ($tos) ->
            expect($tos.currentLanguage).toEqual 'zh-TW'

    describe '$tos.$get()', ->
        it '$tos.languages is equal $tosProvider.languages', inject ($tos) ->
            expect($tos.languages).toBe tosProvider.languages
        it '$tos.currentLanguage is equal $tosProvider.currentLanguage', inject ($tos) ->
            expect($tos.currentLanguage).toBe tosProvider.currentLanguage
        it '$tos._() is equal $tosProvider._()', inject ($tos) ->
            expect($tos._).toBe tosProvider._
        it '$tos.getCards() is equal $tosProvider.getCards()', inject ($tos) ->
            expect($tos.getCards).toBe tosProvider.getCards
        it '$tos.getCard() is equal $tosProvider.getCard()', inject ($tos) ->
            expect($tos.getCard).toBe tosProvider.getCard
        it '$tos.searchCards() is equal $tosProvider.searchCards()', inject ($tos) ->
            expect($tos.searchCards).toBe tosProvider.searchCards
        it '$tos.searchCardsBySpecies() is equal $tosProvider.searchCardsBySpecies()', inject ($tos) ->
            expect($tos.searchCardsBySpecies).toBe tosProvider.searchCardsBySpecies
