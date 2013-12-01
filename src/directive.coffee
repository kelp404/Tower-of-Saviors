a = angular.module 'tos.directive', ['tos.provider']


# ----------------------------------------
# tos-lan
# ----------------------------------------
tosLan = ($injector) ->
    restrict: 'A'
    link: (scope, element, attrs) ->
        # providers
        $tos = $injector.get '$tos'

        attrs.$observe 'tosLan', (value) ->
            element.text $tos._(value)

tosLan.$inject = ['$injector']
a.directive 'tosLan', tosLan
