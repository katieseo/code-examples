// References
// https://github.com/tutsplus/sw-front


// The best way to save data between routes.
// -------------------------------------------------------------------------------------------------------

// * services
myApp.factory('myService', function () {
    var formData = {};

    return {
        getData: function () {
            //You could also return specific attribute of the form data instead
            //of the entire data
            return formData;
        },
        setData: function (newFormData) {
            //You could also set specific attribute of the form data instead
            formData = newFormData
        },
        resetData: function () {
            //To be called when the data stored needs to be discarded
            formData = {};
        }
    };
});

// * controller

myApp.controller('FirstStepCtrl', ['$scope', 'myService', function ($scope, myService) {
    //This is the controller of the first step in the form
    //Reset the data to discard the data of the previous form submission
    myService.resetData();

    //Remaining Logic here
}]);

myApp.controller('LastStepCtrl', ['$scope', 'myService', function ($scope, myService) {
    //This is the controller of the last step in the form

    //Submits the form
    $scope.submitForm = function () {
        //Code to submit the form

        //Reset the data before changing the route - assuming successful submission
        myService.resetData();

        //Change the route
    };

    //Remaining Logic here
}]);



// Angularjs project structure example
// -------------------------------------------------------------------------------------------------------

// main.js

angular.module('App', ['App.services', 'App.directives', 'App.filters', 'App.controllers']).
    run(['$rootScope', function ($rootScope) {
        $rootScope.rootValue = {}; //superscrollorama
    }]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/:newsType/detail/:id',
            {
                action: 'news.details'
            }).
            when('/news',
            {
                redirectTo: '/news/list'
            }).
            when('/news/:id',
            {
                action: 'news'
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

angular.module('App.services', []).
    factory('configService', function () {
        return  {
            endpoints: {
                baseUrl: window.location.protocol + "//" + window.location.host,
                getNewsList: '/news/list.json',
                getNewsDetailsEndpoint: '/releaseNote/detail/'
            },
            constants: {
                NewssPerPage: 5,
                responsive: Modernizr.touch
            }
        };
    })


// filters.js

angular.module('app.filters', []).
    filter('truncate', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });

// controllers.js

angular.module('App.controllers', []).
    controller('AppController', ['$rootScope', '$route', '$timeout', function($rootScope, $route, $timeout) {
        $timeout(function() {
            if ($route.current.action) {
                $rootScope.$broadcast('routeUpdate', {action: $route.current.$$route.action, params: $route.current.pathParams});
            }
        });
    }]).
    controller('newsController', ['$scope', '$rootScope', '$http', '$location', '$timeout', 'configService', '$route', function ($scope, $rootScope, $http, $location, $timeout, configService, $route) {
        var self = this;
        self.variable1;
        self.variable2 = {};
        self.variable3 = false;
        $scope.scope1 = [];
        $scope.scope2;
        $scope.scope3 = false;
        $scope.NewssPerPage = configService.constants.NewssPerPage;

        $rootScope.$on('routeUpdate', function(event, data) {
            switch(data.action) {
                case 'news.details':
                    //dosomething
                break;
                case 'news.list':
                    //dosomething
                break;
            }
        });
        $scope.newsInit = function() {
            $timeout(function() {
                if(!self.routeLoad) {
                    self.getNews('news');
                }
            });
            
        }

        $scope.changeNewsSection = function(type) {
            $location.path('/' + type + '/list');
            $timeout(function() {
                $rootScope.$broadcast('routeUpdate', {action: $route.current.$$route.action, params: $route.current.pathParams});
            });
        }

        $scope.showDetails = function(route) {
            $location.path(route);
            $timeout(function() {
                $rootScope.$broadcast('routeUpdate', {action: $route.current.$$route.action, params: $route.current.pathParams});
            });
        }

        $scope.back = function() {
            $location.path('/' + $scope.currentNewsSet + '/list');
            $timeout(function() {
                $rootScope.$broadcast('routeUpdate', {action: $route.current.$$route.action, params: $route.current.pathParams});
            });
        }

        $scope.changePage = function(offset) {
            self.getNewss($scope.currentNewsSet, offset);
        }

        self.getNewss = function(type, offset) {
            if(!offset) {
                offset = 0;
            }
            if(type !== $scope.currentNewsSet || offset !== $scope.currentOffset) {
                $scope.pages = [];
                var endpoint;
                self.nextNewsSet = type;
                switch(type) {
                    case 'case1':
                        $scope.detailsEndpoint = configService.endpoints.endpointname;
                        endpoint = configService.endpoints.getPatchList;
                        break;
                    case 'case2':
                        $scope.detailsEndpoint = configService.endpoints.endpointname;
                        endpoint = configService.endpoints.getCommunityList;
                        break;
                    case 'case3':
                    default:
                        $scope.detailsEndpoint = configService.endpoints.endpointname;
                        endpoint = configService.endpoints.getNewsList;
                        break;
                }
                self.loadNews(endpoint, offset);
            }
            $scope.activeNews = null;
            
        }

        self.loadNewss = function(endpoint, offset) {
            if(!offset) {
                offset = 0;
            }
            $scope.loading = true;
            $scope.currentOffset = offset;
            if(endpoint) {
                $http.get(endpoint + '?max=' + $scope.NewssPerPage + '&offset=' + offset)
                    .success(self.getNewsSuccess)
                    .error(self.getNewsError);
            } else {
                $scope.Newss = [];
            }
        }

        self.getNewsSuccess = function(data, status) {
            for(var i = 0; i < data.newsList.length; i++) {
                self.NewsLookup[data.newsList[i].id] = data.newsList[i];
            }
            $scope.Newss = data.newsList;
            $scope.currentNewsSet = self.nextNewsSet;
            self.nextNewsSet = '';
            $scope.loading = false;
            if(self.NewsDetailsToLoad) {
                self.setActiveNews(self.NewsDetailsToLoad);
                self.NewsDetailsToLoad = null;
            }
            self.buildPages(data.newsTotal);
        }

        self.getNewsError = function(data, status) {
            $scope.Newss = [];
            $scope.loading = false;
        }

        self.loadNews = function (endpoint) {
            if(endpoint) {
                $http.get(endpoint)
                    .success(self.getNewsSuccess)
                    .error(self.getNewsError);
            }
        }

        self.getNewsSuccess = function(data, status) {
            $scope.activeNews = data.newsItem;
            $scope.activeNews.fullUrl = configService.endpoints.baseUrl + $scope.detailsEndpoint + $scope.activeNews.id;
        }

        self.getNewsError = function(data, status) {
            
        }

        self.setActiveNews = function(id) {
            if(self.NewsLookup.hasOwnProperty(id)) {
                $scope.activeNews = self.NewsLookup[id];
                $scope.activeNews.fullUrl = configService.endpoints.baseUrl + $scope.detailsEndpoint + $scope.activeNews.id;
            } else {
                self.loadNews(configService.endpoints.baseUrl + $scope.detailsEndpoint + '.json?id=' + id);
            }
        }

        self.buildPages = function(total) {
            for(i = 0; i < Math.ceil(total / configService.constants.NewssPerPage); i++) {
                $scope.pages.push(i * configService.constants.NewssPerPage);
            }
        }

    }]).
    controller('NavController', ['$scope', '$rootScope', '$timeout', '$route', '$location', function ($scope, $rootScope, $timeout, $route, $location) {
        $scope.currentSection;
        $rootScope.$on('waypoint', function(event, params) {
            $timeout(function () {
                $location.path(params.waypointName);
                $scope.currentSection = params.waypointName;
            });
        });

        $scope.goTo = function(action) {
            $rootScope.$broadcast('routeUpdate', {action: action, params: $route.current.pathParams});
        }
    }]).
    controller('GalleryController', ['$scope', '$timeout', 'configService', function($scope, $timeout, configService) {
        $scope.galleryInit = function() {
            $timeout(function () {
                $scope.shareUrl = configService.endpoints.baseUrl + '/#/mediaGallery';
            }); 
        };
    }]).
    controller('infoController', ['$scope', 'infoData', '$rootScope', '$timeout', function($scope, infoData, $rootScope, $timeout) {
        $scope.activeSection = 'items'; // Need to make items section active first for carousel to initialize
        $scope.items = infoData.items;
        $scope.howToData = infoData.howTo;

        // add videoId to howToData
        angular.forEach($scope.howToData, function(value, key){
            var videoUrl = $scope.howToData[key].video,
                idIndex = videoUrl.indexOf('embed/') + 6,
                videoId = videoUrl.substr(idIndex);
            $scope.howToData[key].videoId = videoId;
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

        $rootScope.$on('routeUpdate', function(event, data) {
            // switch to items
            if (data.params.itemTitle) {
                $(window).load(function(){
                    $scope.setActiveSection('items');
                });
            }
        });
    }]);


// directives.js

angular.module('App.directives', []).
    directive('clickPreventDefault', function() {
        return function(scope, element, attrs) {
            $(element).click(function(event) {
                event.preventDefault();
            });
        }
    }).
    directive('formatTime', function () {
        return {
            restrict: 'A',
            scope: {
                time: '@formatTime'
            },
            template: "<time>{{time | date:'longDate'}}</time>"
        }
    }).
    directive('animateFadeIn', ['$rootScope', 'configService' , function ($rootScope, configService) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                if(!configService.constants.responsive) {
                    var tween = TweenMax.from($(element), parseFloat(attrs.tweenDuration), {opacity: '0', delay: parseFloat(attrs.tweenDelay)});

                    $rootScope.scrolloramaController.addTween(
                        $(element), tween, 0, parseInt(attrs.tweenOffset)
                    );
                }
            }
        }
    }]).
    directive('animateMoveUp', ['$rootScope', 'configService', function ($rootScope, configService) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                if(!configService.constants.responsive) {
                    var tween = TweenMax.from($(element), 1.5, {bottom: attrs.bottomOffset, delay: parseFloat(attrs.tweenDelay), ease: Power1.easeOut});

                    $rootScope.scrolloramaController.addTween(
                        $(element), tween, 0, parseInt(attrs.tweenOffset)
                    );
                }
            }
        }
    }]).
    directive('animateHome', ['$rootScope', 'configService', function ($rootScope, configService) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                if(!configService.constants.responsive) {
                    $rootScope.scrolloramaController.addTween(
                        $(element),
                        (new TimelineLite())
                            .append([
                                TweenMax.from($('#home-a'), 4, {delay: 5, css:{bottom: -30}, ease: Power1.easeOut}),
                                TweenMax.from($('#home-b'), 4, {delay: 5, css:{bottom: -100}, ease: Power1.easeOut}),
                                TweenMax.from($('#home-c'), 5, {delay: 5, css:{bottom: -300}, ease: Power1.easeOut})
                            ]),
                        1200
                    );
                }
            }
        }
    }]).
    directive('animateGallery', ['$rootScope', 'configService', function ($rootScope, configService) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                if(!configService.constants.responsive) {
                    $rootScope.scrolloramaController.addTween(
                        $(element),
                        (new TimelineLite())
                            .append([
                                TweenMax.from($('#gallery-a'), 4, {delay: 0, css:{marginBottom: '-1090px'}}),
                                TweenMax.from($('#gallery-b'), 1, {delay: 0, css:{marginBottom: '-470px'}}),
                                TweenMax.from($('.gallery-c'), 4, {delay: 0, css:{marginTop: '21%'}})
                            ]),
                        1700,
                        -300
                    );
                }
            }
        }
    }]).
    directive('animateDibs', ['$rootScope', 'configService', function ($rootScope, configService) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                if(!configService.constants.responsive) {
                    var bezierCoordinates = [
                        {left: '15%', top: '55%'},
                        {left: '14%', top: '54%'},
                        {left: '13%', top: '55%'},
                        {left: '14%', top: '56%'},
                        {left: '15%', top: '55%'}
                    ];
                    var tween = TweenMax.to($(element), 4, {bezier: bezierCoordinates, ease: Linear.easeNone, repeat: -1, onStart: function() {
                        this.timeScale(2.5);
                    }});

                    $rootScope.scrolloramaController.addTween($(element), tween, 0, -300, false);
                }
            }
        }
    }]).
    directive('NewsDetails', function () {
        return {
            restrict: 'A',
            template: '<h1>{{activeNews.title}}</h1><div ng-bind-html-unsafe="activeNews.encoded"></div>'
        }
    }).
    directive('socialPanel', function() {
        return {
            restrict: 'A',
            scope: {
                url: '@shareUrl',
                id: '@socialPanel'
            },
            controller: ['$scope', '$element', '$attrs', '$timeout', '$compile', function($scope, $element, $attrs, $timeout, $compile) {

                $scope.$watch("url", function(newUrl) {
                    if(newUrl.length) {

                        //we only want to compile into the dom when we know the new url has been set (sometimes it can be empty while updating s
                        $element.append($compile('<div class="social-sharing"><div class="fb" id="{{id}}-fb"><fb:like send="false" layout="box_count" width="100" show_faces="false"></fb:like></div><div class="gplus"><div id="{{id}}-gplus"></div></div><div id="{{id}}-twitter" class="twitter"></div></div>')($scope));

                        $timeout(function() {
                            if(typeof(FB) !== 'undefined') {
                                $element.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(event){
                                    if (event.target === this) {
                                        $element.toggleClass('active', !!$attrs.shareUrl);
                                    }
                                });
                                $($scope.id + '-fb .fb_iframe_widget').attr('href', newUrl);
                                FB.XFBML.parse(document.getElementById($scope.id + '-fb'));
                            }
                            
                            if(typeof(gapi) !== 'undefined') {
                                gapi.plusone.render($scope.id + '-gplus', { 'href': newUrl, 'size': 'tall'});
                            }

                            if(typeof(twttr) !== 'undefined') {
                                document.getElementById($scope.id + '-twitter').innerHTML = "";
                                twttr.widgets.createShareButton(
                                    newUrl,
                                    document.getElementById($scope.id + '-twitter'),
                                    null,
                                    {
                                        count: 'vertical'
                                    }
                                );
                            }

                        });
                    }
                })
            }]
        }
    }).
    directive('waypoint', ['$rootScope', function($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                var offset = (attrs.waypointOffset ? attrs.waypointOffset : '50px'),
                    jqElem = $(elem),
                    id = attrs.waypoint.length ? attrs.waypoint : jqElem.attr('id'),
                    broadcastWaypoint = function(dir) {
                        $rootScope.$broadcast('waypoint',{'waypointName': id, 'direction': dir});
                    };

                jqElem.waypoint({
                    handler: function(dir) {
                        if (dir === 'down') {
                            broadcastWaypoint(dir);
                        }
                    },
                    offset: offset
                });
                jqElem.children(':first').waypoint({
                    handler: function(dir) {
                        if (dir === 'up') {
                            broadcastWaypoint(dir);
                        }
                    },
                    offset: '-'+ offset
                });
            }
        }
    }]).
    directive('scrollbar', function() {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                $(window).load(function() {
                    $(elem).mCustomScrollbar(
                    {
                        advanced: {
                            updateOnContentResize: true
                        },
                        scrollButtons: {
                            enable: true
                        },
                        autoDraggerLength: false
                    });
                });
            }
        }
    }).
    directive('galleria', ['localStrings', '$location', 'galleriaData', function(localStrings, $location, galleriaData) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                var landingOptions = {
                    popupLinks: true,
                    responsive: true,
                    imageCrop: true,
                    transition: 'fade',
                    thumbnails: 'empty',
                    dataSource: galleriaData.landing,
                    fullscreenDoubleTap: false
                };

                var galleryOptions = {
                    responsive: true,
                    imageCrop: false,
                    showInfo: false,
                    transition: 'slide',
                    thumbnails: true,
                    dataSource: galleriaData.gallery,
                    fullscreenDoubleTap: false
                };

                var theme = {
                    name: 'App',
                    init: function(options) {
                        var galleria = this;
                        var galleriaTarget = galleria._target.id;

                        if (galleriaTarget === 'landing-carousel') {
                            var landingDiv = $('#landing-carousel');
                            var playNowButton = $('<a class="play-now-button" href="/betaSignup"><span>' + localStrings.messages.registerString + '</span></a>');

                            playNowButton.appendTo(landingDiv.find('.galleria-container'));

                            this.bind('loadfinish', function(e) {
                                landingDiv.find('.galleria-image-nav').appendTo(landingDiv.find('.galleria-thumbnails-list'));
                                landingDiv.find('.galleria-thumbnails-list').css('overflow', 'visible');
                                landingDiv.find('.galleria-thumbnails').css('overflow', 'visible');
                            });
                        } else if (galleriaTarget === 'gallery-carousel') {
                            var overlayMode = false;

                            var carouselDiv = $('#gallery-carousel');
                            var topDiv = $('<div class="galleria-top"></div>');
                            var playButton = $('<button class="galleria-play"><span>Play</span></button>');
                            var downloadButton = $('<a class="galleria-download" target="blank"><span>Download</span></a>')
                            var fullscreenButton = $('<button class="galleria-fullscreen"><span>Fullscreen</span></button>');
                            var mediaDiv = $('<div class="galleria-media"></div>');
                            var imageDiv = carouselDiv.find('.galleria-image');

                            var toggleThumbnailsOverlay = function () {
                                carouselDiv.find('.galleria-thumbnails-container, .galleria-thumbnails-list, ' +
                                        '.galleria-thumbnails, .galleria-thumb-nav-left, .galleria-thumb-nav-right')
                                    .toggleClass('galleria-thumbnails-overlay', !overlayMode);
                                overlayMode = !overlayMode;
                            };

                            topDiv.prependTo(carouselDiv.find('.galleria-container'));

                            playButton.appendTo(topDiv);
                            playButton.on('click', function (e) {
                                galleria.playToggle(5000);
                            });

                            downloadButton.appendTo(topDiv);

                            fullscreenButton.appendTo(topDiv);
                            fullscreenButton.on('click', function (e) {
                                galleria.openLightbox();
                            });

                            mediaDiv.prependTo(carouselDiv.find('.galleria-thumbnails-container'));
                            mediaDiv.on('click', function(e) {
                                toggleThumbnailsOverlay();
                            });

                            imageDiv.on('click', function (e) {
                                if (overlayMode) {
                                    toggleThumbnailsOverlay();
                                }
                            });

                            this.bind('lightbox_image', function(e) {
                                if($(e.imageTarget).get(0).tagName === "IFRAME") {
                                    $(window).resize(function() {
                                        $(e.imageTarget).width($(e.imageTarget).parent().width());
                                        $(e.imageTarget).height($(e.imageTarget).parent().height());
                                    })
                                    $(window).resize();
                                }
                            })

                            this.bind('lightbox_close', function(e) {
                                $(window).unbind('resize');
                            });

                            this.bind('image', function(e) {
                                if (e.galleriaData.image) {
                                    downloadButton.css('display', 'inline-block');
                                    carouselDiv.find('.galleria-download').attr('href', e.galleriaData.image);
                                    carouselDiv.find('.galleria-info').prependTo(carouselDiv.find('.galleria-stage'));
                                } else {
                                    carouselDiv.find('.galleria-info').remove();
                                    downloadButton.css('display', 'none');
                                }

                                if (e.index !== 0) {
                                    $location.path('/media/' + galleria.getIndex());
                                    scope.$apply();
                                }
                            });
                        }
                    }
                };

                var locationPath = $location.path().split('/');
                if (locationPath[1] == 'media') {
                    galleryOptions['show'] = locationPath[2];
                }

                Galleria.addTheme(theme);
                Galleria.run('#landing-carousel', landingOptions);
                Galleria.run('#gallery-carousel', galleryOptions);
            }
        }
    }]).
    directive('mobileNav', ['configService', function(configService) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var mainNav = $('#nav-main');
                var mainNavAnchors = $('a', mainNav);
                var mobileNavShown = false;

                var toggleMobileNav = function (toggleSwitch) {
                    if (toggleSwitch) {
                        elem.hide();
                        mainNav.show().focus();
                        mobileNavShown = true;
                    } else {
                        if (mobileNavShown) {
                            mainNav.hide();
                            elem.show();
                            mobileNavShown = false;
                        }
                    }
                }

                elem.click(function (e) {
                    toggleMobileNav(true);
                });

                mainNavAnchors.click(function(e) {
                    toggleMobileNav(false);
                });

                mainNav.blur(function (e) {
                    setTimeout(toggleMobileNav, 500);
                });
            }
        }
    }]).
    directive('displayLightbox', function () {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var group = attrs.displayLightbox,
                    cboxWidth = ( $(window).innerWidth() > 1280 ) ? 1280 : $(window).innerWidth(),
                    cboxHeight = parseInt( cboxWidth * 0.62, 10 ),
                    options = {rel:group, current:'{current} / {total}', maxWidth:'100%', maxHeight:'100%', previous:'', next:'', close:''};
                
                if( $(element).hasClass('youtube') ){

                    options.iframe = true;
                    options.innerWidth = cboxWidth;
                    options.innerHeight = cboxHeight;

                    $(element).colorbox(options);

                } else {
                    $(element).colorbox(options);
                }
            }
        }
    }).
    directive('itemsOverlay', function(){
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$on('activeSectionChange', function(event, data){
                    if (data.section == 'items') {
                        element.show();
                    } else {
                        element.hide();
                    }
                });
            }
        }
    }).
    directive('itemsDetails', ['$http', 'configService', 'orderByFilter', '$location', '$rootScope', '$timeout', function ($http, configService, orderByFilter, $location, $rootScope, $timeout) {
        return {
            restrict: 'A',
            templateUrl: '/static/theme/App/templates/items-details.html',
            controller: ['$scope', '$location', function ($scope, $location) {

                // Show item details
                $scope.item.showDetails = function () {
                    $scope.item.visible = true;
                };
                // Ablities
                $scope.item.getAbilities = function () {
                    var endpoint = configService.endpoints.getitemAbilitiesEndpoint,
                        encodedTitle = encodeURI($scope.item.title);
                    $http.get(endpoint + 'getitemAbilities?title=' + encodedTitle)
                        .success(function (data) {
                            $scope.item.abilities = orderByFilter(data, 'title');
                            $scope.item.setCurrentAbility();
                        })
                        .error(function () {
                            $scope.item.abilities = [];
                        });
                };
                $scope.item.setCurrentAbility = function () {
                    if ($scope.item.abilities.length > 0) {
                        $scope.item.abilities.current = $scope.item.abilities[0];
                    }
                };
                $scope.item.showAbility = function (ability) {
                    $scope.item.abilities.current = ability;
                };
                // Media
                $scope.item.setMedia = function () {
                    if ($scope.item.video_urls.length > 0) {
                        $scope.item.currentMedia = $scope.item.video_urls[0];
                        $scope.item.currentMediaUrl = '//www.youtube.com/embed/' + $scope.item.video_urls[0];
                    }
                };
                $scope.item.showMedia = function (mediaID) {
                    $scope.item.currentMedia = mediaID;
                    $scope.item.currentMediaUrl = '//www.youtube.com/embed/' + mediaID;
                };
                // Gallery
                $scope.item.gallery = function (elem) {
                    var GalleryCarousel = {
                        init: function (elem) {
                            var self = this;
                            self.elem = elem;
                            self.setting();
                            self.updateButtons();
                            self.buttons.on('click', self.transition);
                        },
                        setting: function () {
                            var self = this;
                            self.imgWidth = self.elem.width();
                            self.lis = self.elem.find('li').css('width', self.imgWidth);
                            self.imgsLength = self.lis.length;
                            self.container = self.elem.find('ul').css({
                                'width': self.imgsLength * self.imgWidth
                            });
                            self.buttons = self.elem.find('.button');
                            self.current = 0;
                            if (self.imgsLength <= 1) {
                                self.buttons.addClass('disabled');
                            }
                        },
                        updateButtons: function () {
                            var self = this,
                                btnPrev = self.buttons.filter('[data-dir=prev]'),
                                btnNext = self.buttons.filter('[data-dir=next]');
                            (self.current == 0) ? btnPrev.addClass('disabled') : btnPrev.removeClass('disabled');
                            (self.current == self.imgsLength - 1) ? btnNext.addClass('disabled') : btnNext.removeClass('disabled');
                        },
                        transition: function () {
                            var self = GalleryCarousel,
                                dir = $(this).attr('data-dir'),
                                position = self.current;
                            // set current
                            position += (dir === 'next') ? 1 : -1;
                            self.current = position % self.imgsLength;
                            // slide container
                            self.container.animate({
                                'margin-left': -(self.current * self.imgWidth)
                            });
                            self.updateButtons();
                        }
                    };
                    GalleryCarousel.init(elem);
                };
                $scope.item.routeUpdate = function(){
                    $location.path('/info/items/' + $scope.item.title);
                    //save the url so we can share with the social media panel (as they require it)
                    $scope.absUrl = $location.absUrl();
                };

                $scope.item.routeClose = function(){
                    $location.path('/info');
                }
            }],
            link: function (scope, element, attrs) {
                // position a item using X,Y offset
                var blockHeight = element.height(),
                    itemImage = element.find('.item-image'),
                    image_x_offset = (scope.item.image_x_offset == '') ? 0 : parseInt(scope.item.image_x_offset),
                    image_y_offset = (scope.item.image_y_offset == '') ? 0 : parseInt(scope.item.image_y_offset);

                itemImage.load(function(){
                    var imgHeight = itemImage.height(),
                        itemYcenter = ( imgHeight > blockHeight ) ? - ((imgHeight - blockHeight) / 2) : 0 ,
                        itemYoffset = ( image_y_offset ) ? itemYcenter + image_y_offset : itemYcenter ;

                    if ( image_x_offset ) {
                        itemImage.css('left', image_x_offset + 'px');
                    }
                    if ( itemYoffset ) {
                        itemImage.css('top', itemYoffset  + 'px');
                    }
                });

                // details in colorbox
                var group = attrs.itemsDetails,
                    cboxWidth = 1000, //design width was 950 with room for social panel = 1000
                    options = {
                        rel: group,
                        current: '',
                        previous: '',
                        next: '',
                        close: '',
                        inline: true,
                        href: '#' + scope.item.id,
                        width: cboxWidth,
                        onLoad: function () {
                            if (!scope.item.visible) {
                                // get abilities, show details
                                scope.$apply(scope.item.getAbilities);
                                scope.$apply(scope.item.showDetails);
                                // scrollbar
                                if (!scope.item.scrollbarInit) {
                                    scope.item.scrollbarInit = true;
                                    $(element).find('[data-scrollbar]').mCustomScrollbar({
                                        advanced: {
                                            updateOnContentResize: true
                                        },
                                        scrollButtons: {
                                            enable: true
                                        },
                                        autoDraggerLength: false
                                    });
                                }
                                // media
                                scope.$apply(scope.item.setMedia);
                            }
                            // route
                            scope.$apply(scope.item.routeUpdate);
                        },
                        onComplete: function () {
                            var itemId = $("[id='" + scope.item.id + "']");
                            // gallery
                            if (!scope.item.gallery.initialized) {
                                scope.item.gallery.initialized = true;
                                scope.item.gallery(itemId.find('.item-gallery'));
                            }
                        },
                        onClosed: function(){
                            // route
                            scope.$apply(scope.item.routeClose);
                        }
                    };
                $(element).colorbox(options);

                // open a item details
                $rootScope.$on('routeUpdate', function(event, data) {
                    if(data.params.itemTitle === scope.item.title) {
                        
                    }
                });
            }
        }
    }]).
    directive('scrollTo', ['$rootScope', 'configService', function($rootScope, configService) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                $rootScope.$on('routeUpdate', function(event, data) {
                    if(data.action == attrs.linkAction) {
                        // dosomething
                        } else {
                        // dosomething       
                    }
                });
            }
        }
    }])