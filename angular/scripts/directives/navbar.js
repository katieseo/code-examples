'use strict';

/**
 * @ngdoc function
 * @name myApp.directive:navbar
 * @description
 * # navbar
 * Directive of the myApp
 */

angular.module('myApp')
    .directive('navbar', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/navbar.html',
            controller: 'NavbarCtrl'
        }
    });