
a = angular.module 'tos.controller', ['tos.provider']


# ----------------------------------------
# IndexController
# ----------------------------------------
IndexController = ($scope) ->
    console.log 'index'

IndexController.$inject = ['$scope']
a.controller 'IndexController', IndexController
