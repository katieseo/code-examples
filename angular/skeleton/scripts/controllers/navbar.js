'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the myApp
 */

angular.module('myApp')
    .controller('NavbarCtrl', ['$scope', '$location', function ($scope, $location) {
        
        $scope.isActive = function( path ) {
            return path === $location.path();
        };

    }]);