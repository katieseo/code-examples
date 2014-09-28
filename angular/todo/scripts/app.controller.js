(function(){
    'use strict';

    angular
        .module('app')
        .controller('MainCtrl', MainCtrl);

    function MainCtrl ( $scope, TodoService ) {
        var vm = this;

        vm.init = init;
        vm.todos = [];
        vm.newTodo = '';
        vm.addTodo = addTodo;
        vm.nav = 'All';
        vm.todoSortable = todoSortable();
        vm.deleteTodo = deleteTodo;
        vm.todoFilter = todoFilter;

        $scope.$watch('main.todos', updateData, true);

        /**
        * Functions
        */

        function init () {
            TodoService.initData();
            vm.todos = TodoService.getData();
        }

        function addTodo () {
            var newTodo = {
                'name': vm.newTodo,
                'isDone': false
            }
            vm.todos.push(newTodo);
            vm.newTodo = '';
        };

        function deleteTodo (index) {
            vm.todos.splice(index, 1);
        };

        function updateData() {
            TodoService.updateData( vm.todos );
        }

        function todoFilter( todo ){
            if (vm.nav === 'All') {
                return true;
            } else if (todo.isDone && vm.nav === 'Complete') {
                return true;
            } else if (!todo.isDone && vm.nav === 'Incomplete') {
                return true;
            } else {
                return false;
            }
        };

        function todoSortable() {
            return {
                containment: 'parent',
                cursor: 'move',
                tolerance: 'pointer'
            }
        };
    };

})();