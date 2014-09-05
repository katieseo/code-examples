'use strict';

/**
 * @ngdoc function
 * @name myApp.services:LoginCtrl
 * @description
 * # LoginCtrl
 * Service of the myApp
 */

// service: easy to create a method on the object than factory
angular.module('myApp')
    .service('tests', function () {
        this.query = function(){
            return [
                {
                    name: 'test name',
                    description: 'description...',
                    category: {
                        name: 'test category name'
                    },
                    requirements: [
                        { name: null, value: 'novice' },
                        { name: 'vigor', value: 'd6' },
                    ]
                },
                {
                    name: 'test name 2',
                    description: 'description 2...',
                    category: {
                        name: 'test category name 2'
                    },
                    requirements: [
                        { name: null, value: 'novice 2' },
                        { name: 'vigor 2', value: 'd6 2' },
                    ]
                }
            ]
        }
    });