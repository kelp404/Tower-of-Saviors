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
# tos-fadein-onload
# ----------------------------------------
tosFadeinOnload = ->
    restrict: 'A'
    link: (scope, element) ->
        element.addClass 'fade'
        element.bind 'load', -> element.addClass 'in'
a.directive 'tosFadeinOnload', tosFadeinOnload
