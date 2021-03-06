a = angular.module 'tos.directive', ['tos.provider']


# ----------------------------------------
# tos-lang
# ----------------------------------------
tosLang = ($injector) ->
    restrict: 'A'
    link: (scope, element, attrs) ->
        # providers
        $tos = $injector.get '$tos'

        attrs.$observe 'tosLang', (value) ->
            element.text $tos._(value)

tosLang.$inject = ['$injector']
a.directive 'tosLang', tosLang


# ----------------------------------------
# tos-goto-top
# ----------------------------------------
tosGotoTop = ->
    restrict: 'A'
    link: (scope, element) ->
        element.click ->
            $('html, body').animate scrollTop: 0, 300
            no
a.directive 'tosGotoTop', tosGotoTop


# ----------------------------------------
# tos-loading-cover
# ----------------------------------------
tosLoadingCover = ->
    restrict: 'A'
    link: (scope, element, attrs) ->
        $cover = $ attrs.tosLoadingCover
        $cover.bind 'load', ->
            $cover.parent().css 'min-height', $cover.height()
        element.bind 'load', ->
            $cover.parent().css 'min-height', ''
            $cover.fadeOut()
a.directive 'tosLoadingCover', tosLoadingCover
