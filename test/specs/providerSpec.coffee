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


    describe '$tos.$get()', ->
        it '$tos.languages is equal $tosProvider.languages', inject ($tos) ->
            expect($tos.languages).toBe tosProvider.languages
