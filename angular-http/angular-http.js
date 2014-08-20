// main.js

angular.module('app', ['app.services', 'app.directives', 'app.filters', 'app.controllers']).
    run(['$rootScope', function ($rootScope) {
        $rootScope.someController = $.somePlugin();
    }]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/:articleType/detail/:id',
            {
                action: 'articles.details'
            }).
            when('/:articleType/list',
            {
                action: 'articles.list'
            }).
            when('/home',
            {
                action: 'home'
            }).
            otherwise(
            {
                redirectTo: '/'
            });
    }]);

// services.js

angular.module('app.services', []).
    factory('configService', function () {
        return  {
            endpoints: {
                baseUrl: window.location.protocol + "//" + window.location.host,
                getArticleList: '/article/list.json',
                getArticleListDetailsEndpoint: '/article/detail/',
                getArticleDetailsEndpoint: '/article/'
            },
            constants: {
                articlesPerPage: 5
            }
        };
    }).
    factory('otherFactory', function () {
        return {
        };
    });

// directives.js

    directive('articleDetails', ['$http', 'configService', 'orderByFilter', '$location', '$rootScope', '$timeout', function ($http, configService, orderByFilter, $location, $rootScope, $timeout) {
        return {
            restrict: 'A',
            templateUrl: '/static/theme/app/templates/article-details.html',
            controller: ['$scope', '$location', function ($scope, $location) {

                // Details
                $scope.article.getDetails = function () {
                    var endpoint = configService.endpoints.getArticleDetailsEndpoint,
                        encodedTitle = encodeURI($scope.article.title);
                    $http.get(endpoint + 'getArticleDetails?title=' + encodedTitle)
                        .success(function (data) {
                            $scope.article.abilities = orderByFilter(data, 'title');
                            $scope.article.setCurrentAbility();
                        })
                        .error(function () {
                            $scope.article.abilities = [];
                        });
                };
            }],
            link: function (scope, elem, attrs) {

            }
        }
    }]).
    directive('otherDirective', ['$rootScope', 'configService', function($rootScope, configService) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                
            }
        }
    }]);

// controllers.js

angular.module('app.controllers', []).
    controller('AppController', ['$rootScope', '$route', '$timeout', function($rootScope, $route, $timeout) {
        // broadcast
        $timeout(function() {
            if ($route.current.action) {
                $rootScope.$broadcast('routeUpdate', {action: $route.current.$$route.action, params: $route.current.pathParams});
            }
        });

        // set active section
        $scope.setActiveSection = function(section) {
            $scope.activeSection = section;
        };

        $scope.$watch('activeSection', function(newSection, oldSection){
            if( newSection !== oldSection ){
                $timeout(function(){
                    $scope.$broadcast('activeSectionChange', {"section": newSection});
                });
            }
        })
    }]).
    controller('otherController', ['$scope', '$timeout', 'configService', function($scope, $timeout, configService) {
        var self = this;

        self.loadArticle = function (endpoint) {
            if(endpoint) {
                $http.get(endpoint)
                    .success(self.getArticleSuccess)
                    .error(self.getArticleError);
            } else {
                $scope.articles = [];
            }
        }
    }]);