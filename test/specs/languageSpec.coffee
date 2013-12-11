describe 'tos.provider', ->
    fakeModule = null
    lanProvider = null

    beforeEach module('tos.languageResource')
    beforeEach ->
        # fack module
        fakeModule = angular.module 'fakeModule', ['tos.languageResource']
        fakeModule.config ($lanProvider) ->
            lanProvider = $lanProvider
    beforeEach module('fakeModule')


    describe '$lan.resource', ->
        it '$lan.resource has members "en" and "zh-TW"', inject ($lan) ->
            expect(['en', 'zh-TW']).toEqual Object.keys($lan.resource)
            expect('Light').toEqual $lan.resource.en.light


    describe '$lan.$get()', ->
        it '$lan.resource is equal $lanProvider.resource', inject ($lan) ->
            expect($lan.resource).toBe lanProvider.resource
