(function(){
    'use strict';

    angular
        .module('app')
        .factory('TodoService', TodoService);

    function TodoService( localStorageService ){
        var todoList = [];

        var TodoService = {
            initData: initData,
            getData: getData,
            updateData: updateData
        };

        return TodoService;

        /**
         * Functions
         */

        function initData () {
            if ( localStorageService.get('todoList') == null ) {
                todoList = [{'name': 'clean house', 'isDone': false}];
            } else {
                todoList = localStorageService.get('todoList');
            }
        };

        function getData () {
            return todoList;
        };

        function updateData (data) {
            todoList = data;
            localStorageService.add('todoList', angular.toJson(todoList));
        }
    };

})();