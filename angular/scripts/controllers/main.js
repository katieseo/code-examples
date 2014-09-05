'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myApp
 */

angular.module('myApp')
    .controller('MainCtrl', ['$scope', 'tests', function ($scope, tests) {
        
        $scope.val1 = true;
        $scope.val2 = 'something';

        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        // tests
        
        $scope.tests = tests.query();

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

        var selectedTest = null;

        $scope.selectTest = function (test) {
            // selectedTest = test;
            selectedTest = ( selectedTest === test ) ? null : test;
        }

        $scope.isSelected = function (test) {
            return test === selectedTest;
        };

        // $resource('/app/test').query();

    }]);