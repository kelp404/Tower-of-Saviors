
a = angular.module 'tos.controller', ['tos.provider']


# ----------------------------------------
# IndexController
# ----------------------------------------
IndexController = ($scope, $injector) ->
    $tos = $injector.get '$tos'

    $tos.getCards()


IndexController.$inject = ['$scope', '$injector']
a.controller 'IndexController', IndexController
