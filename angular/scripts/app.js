'use strict';

/**
 * @ngdoc overview
 * @name myApp
 * @description
 * # myApp
 *
 * Main module of the application.
 */
angular.module('myApp', [
    'ngRoute'
])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html'
            })
            .when('/item', {
                templateUrl: 'views/item.html',
                controller: 'itemCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });