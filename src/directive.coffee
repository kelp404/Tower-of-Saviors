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
# tos-fadein-onload
# ----------------------------------------
tosFadeinOnload = ->
    restrict: 'A'
    link: (scope, element) ->
        element.bind 'load', -> element.addClass 'in'
a.directive 'tosFadeinOnload', tosFadeinOnload
