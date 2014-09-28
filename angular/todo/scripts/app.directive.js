(function(){
    'use strict';

    angular
        .module('app')
        .directive('editInPlace', editInPlace);

    function editInPlace(){
        return {
            restrict: 'E',
            scope: { value: '=' },
            template: '<span ng-click="edit()" ng-bind="value"></span><input ng-model="value"></input>',
            link: function (scope, elem, attrs) {
                var inputElem = angular.element( elem.children()[1] );

                scope.isActive = false;
                elem.addClass('edit-in-place');
                
                scope.edit = edit;
                inputElem.bind('blur', editDone);

                /**
                 * Functions
                 */
                
                function edit(){
                    elem.addClass('active');
                    inputElem[0].focus();
                    scope.isActive = true;
                };

                function editDone(){
                    elem.removeClass('active');
                    scope.isActive = false;
                };

            }
        }
    };

})();