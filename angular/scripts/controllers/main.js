'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myApp
 */

angular.module('myApp')
    .controller('MainCtrl', ['$scope', 'Items', function ($scope, Items) {
        
        $scope.val1 = true;
        $scope.val2 = 'something';

        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        // items
        
        $scope.items = Items.query();

        $scope.displayRequirements = function (reqs) {
            var result = '';
            for (var i=0; i < reqs.length; i++) {
                if (result !== '') { result += ', '; }
                if ( reqs[i].name ) {
                    result += reqs[i].name + ' ';
                }
                result += reqs[i].value;
            }
            return result;
        };

        // description toggle

        var selectedItem = null;

        $scope.selectItem = function (item) {
            // selectedItem = item;
            selectedItem = ( selectedItem === item ) ? null : item;
        }

        $scope.isSelected = function (item) {
            return item === selectedItem;
        };
        
    }]);