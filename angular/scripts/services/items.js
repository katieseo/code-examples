'use strict';

/**
 * @ngdoc function
 * @name myApp.services: Items
 * @description
 * # Items
 * Service of the myApp
 */

// service: easy to create a method on the object than factory
angular.module('myApp')
    .factory('ItemsNew', function($resource){
        return $resource('/api/items/:id', { id: '@id'},
                   { 'update': { method: 'PUT' } } );
    })

    //old query
    .service('Items', function () {
        this.query = function(){
            return [
                {
                    name: 'item name',
                    description: 'description...',
                    category: {
                        name: 'item category name'
                    },
                    requirements: [
                        { name: null, value: 'high' },
                        { name: 'Rabbit', value: 'v1' },
                    ]
                },
                {
                    name: 'item name 2',
                    description: 'description 2...',
                    category: {
                        name: 'item category name 2'
                    },
                    requirements: [
                        { name: null, value: 'low' },
                        { name: 'Sheep', value: 'v6 2' },
                    ]
                }
            ]
        }
    });