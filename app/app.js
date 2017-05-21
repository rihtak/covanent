'use strict';
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.login',
    'myApp.version',
    'ngMaterial',
    'ngStorage',
    'gridshore.c3js.chart'])

    .config(['$locationProvider', '$routeProvider', '$mdThemingProvider','$qProvider', config])
    .filter('titleCase', titleCase)
    .service('Load_document', ['$rootScope', function () {
        var service = {
            Start: Start,
            Stop: Stop
        };
        return service

        function Start($rootScope) {  $rootScope.Load_Document= true; }
        function Stop($rootScope) { $rootScope.Load_Document = false; }
    }])
    .directive('themePreview', themePreview)
    .directive('scrollToBottom', scrollToBottom)
    .directive("outsideClick", ['$document', '$parse', '$timeout', outsideClick])
    .directive('spyStyle', ['$timeout', spyStyle])
    .controller('LeftCtrl', LeftCtrl)
    .controller('RightCtrl', RightCtrl)
    .controller('AppCtrl', AppCtrl)
    .service('myAppFactory', function ($http) {
    return {
        getListOfOrders: function () {
            return $http({
                method: 'GET',
                url: GET_LIST_OF_ORDERS_URL
            });
        },       
         getAvailableTrailers: function () {
            return $http({
                method: 'GET',
                url: GET_AVAILABLE_TRAILERS_URL
            });
        },    
        getRecentAlertData:function(){
            return $http({
                method: 'GET',
                url: RECENT_ALERT_URL
            });

        },
        getMachineData:function(machine){
            return $http({
                method: 'GET',
                url: DETAILED_INFO_ABOUT_MACHINE_URL+"?machineId="+machine.rowid+"&statusVal="+machine.statusVal
            });
        },
        getRecentMachineData:function(machine){
            return $http({
                method: 'GET',
                url: DETAILED_INFO_ABOUT_RECENT_MACHINE_URL+"?machineId="+machine.MachineId
            });
        }
    }
});




function config($locationProvider, $routeProvider, $mdThemingProvider,$qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $locationProvider.hashPrefix('!');
    $mdThemingProvider.alwaysWatchTheme(true);
    $mdThemingProvider.generateThemesOnDemand(true);
    $mdThemingProvider.definePalette('amazingPaletteName', {
        '50': 'ffebee',
        '100': 'ffcdd2',
        '200': 'ef9a9a',
        '300': 'e57373',
        '400': 'ef5350',
        '500': 'f44336',
        '600': 'e53935',
        '700': 'd32f2f',
        '800': 'c62828',
        '900': 'b71c1c',
        'A100': 'ff8a80',
        'A200': 'ff5252',
        'A400': 'ff1744',
        'A700': 'd50000',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
        // on this palette should be dark or light

        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                               '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });

    $mdThemingProvider.theme('primary')
        .primaryPalette('amazingPaletteName')
        .accentPalette('yellow');
    $mdThemingProvider.setDefaultTheme('primary');
    //themes are still defined in config, but the css is not generated
    $mdThemingProvider.theme('altTheme')
        .primaryPalette('blue')

    // If you specify less than all of the keys, it will inherit from the
    // default shades
        .accentPalette('purple', {
        'default': '200' // use shade 200 for default, and keep all other shades the same
    }).dark();
    $mdThemingProvider.theme('altTheme2')
        .primaryPalette('blue')

    // If you specify less than all of the keys, it will inherit from the
    // default shades
        .accentPalette('purple', {
        'default': '200' // use shade 200 for default, and keep all other shades the same
    });

    $routeProvider.otherwise({ redirectTo: '/view2' });
}






function themePreview() {
    return {
        restrict: 'E',
        templateUrl: 'app/colorpicker.tmpl.html',
        scope: {
            primary: '=',
            accent: '='
        },
        controller: function ($scope, $mdColors, $mdColorUtil) {
            $scope.getColor = function (color) {
                return $mdColorUtil.rgbaToHex($mdColors.getThemeColor(color))
            };
        }
    }
}

function scrollToBottom($timeout, $window) {
    return {
        scope: {
            scrollToBottom: "="
        },
        restrict: 'A',
        link: function (scope, element, attr) {
            scope.$watchCollection('scrollToBottom', function (newVal) {
                if (newVal) {
                    $timeout(function () {
                        element[0].scrollTop = element[0].scrollHeight + 10;
                    }, 0);
                }
            });
        }
    };
}

function spyStyle($timeout) {
    return {
        link: function (scope, element, attrs) {
            scope.$watch(function () {
                return element.css(attrs['spyAttribute']);
            }, styleChangedCallBack,
                         true);
            function styleChangedCallBack(newValue, oldValue) {
                if (newValue !== oldValue) {
                    var x = document.querySelectorAll(".md-toolbar_icon");
                    angular.forEach(x, function (item) {
                        $timeout(function () {
                            item.style.color = newValue;
                        }, 0);
                    });
                }
            }

        }
    };

}

function outsideClick($document, $parse, $timeout) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attributes) {
            var onDocumentClick = function (event) {
                var offsetLeft = getOffsetLeft($element);
                var offsetTop = getOffsetTop($element);
                if (((event.target.id != $element[0].id && $parse($attributes.ngShow)($scope))) || event.target.id == $element[0].id + '_icon') {
                    //if (!((event.clientY > $element["0"].offsetTop && event.clientY < parseInt($element["0"].offsetTop + $element["0"].clientHeight)) || (event.clientX > parseInt($element["0"].offsetLeft + $element["0"].clientWidth))) || event.target.id == $element[0].id + '_icon') {
                    $timeout(function () {
                        if (!(event.clientY > offsetTop && event.clientY < parseInt(offsetTop + $element["0"].clientHeight)) || !(event.clientX > offsetLeft && event.clientX < parseInt(offsetLeft + $element["0"].clientWidth)) || event.target.id == $element[0].id + '_icon') {
                            $scope[$attributes.ngShow] = !$scope[$attributes.ngShow];
                            $scope.$apply();
                        }
                    }, 10)
                };
            }
            function getOffsetLeft(elem) {
                elem = elem[0];
                var offsetLeft = 0;
                do {
                    if (!isNaN(elem.offsetLeft)) {
                        offsetLeft += elem.offsetLeft;
                    }
                } while (elem = elem.offsetParent);
                return offsetLeft;
            }
            function getOffsetTop(elem) {
                elem = elem[0];
                var offsetTop = 0;
                do {
                    if (!isNaN(elem.offsetTop)) {
                        offsetTop += elem.offsetTop;
                    }
                } while (elem = elem.offsetParent);
                return offsetTop;
            }
            $document.on("click", onDocumentClick);
            if (_hasTouch()) {
                $document.on('touchstart', eventHandler);
            }
            $element.on('$destroy', function () {
                if (_hasTouch()) {
                    $document.off('touchstart', eventHandler);
                }
                $document.off("click", onDocumentClick);

            });
            function _hasTouch() {
                return 'ontouchstart' in window || navigator.maxTouchPoints;
            };
        }
    }
}


function titleCase() {
    return function (input) {
        input = input || '';
        return input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    };
}

function LeftCtrl($scope, $timeout, $mdSidenav, $log,myAppFactory,$mdDialog) {
    $scope.close = function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('left').close()
            .then(function () {
            $log.debug("close LEFT is done");
        });


    }
    $scope.showMachineDetail = function(event,machine){
        console.log(machine);
        $mdDialog.show({
            controller: function($mdDialog,$scope){
                $scope.machine = machine;
                $scope.titleText = "Last 7 days alerts for machine "+machine.MachineId;
                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };
            },
            templateUrl: 'app/view1/machineDetail.html',
            parent: angular.element(document.body),
            targetEvent:event,   
            animation:undefined,
            clickOutsideToClose:true,
            locals: { machine: machine },
            onComplete:afterShowAnimation,
            fullscreen: true // Only for -xs, -sm breakpoints.
        });
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        function genrateMachineData(){
            var days = [];

            var s = new Date('2017-01-01');
            var e = new Date('2017-01-07');
            var a = [];

            while(s < e) {
                a.push(s);

                //machine.date = s.getFullYear() + "-" +s.getMonth()+1 + "-" +s.getDate();


                s = new Date(s.setDate(
                    s.getDate() + 1
                ));
                var dt = angular.copy(s),
                    rc = [];
                while (dt.getDate() == s.getDate()) {

                    dt.setMinutes(dt.getMinutes() + 30);
                    var machine = {};
                    machine.date = angular.copy(dt);
                    machine.temprature = getRandomInt(150,170);
                    machine.engineNoise = getRandomInt(60,90);
                    days.push(machine); 
                }


            }
            console.log("datapoints ",days.length)

            return days;


        }
        function afterShowAnimation(scope, element, options) {
            // post-show code here: DOM element focus, etc.
            scope.isChartLoading = true;
            myAppFactory.getRecentMachineData(machine).then(function(responseData) {
                var currentData = {"rowid":136,"temperature":178.0,"mDate":"2017-04-07 16:05:18"};
                currentData.rowid = machine.MachineId;
                var s = new Date(machine.timeStamp);
                var hours = s.getHours();
                // Minutes part from the timestamp
                var minutes = "0" + s.getMinutes();
                // Seconds part from the timestamp
                var seconds = "0" + s.getSeconds();
                var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                currentData.mDate = s.getFullYear() + "-" +(parseInt(s.getMonth())+1) + "-" +s.getDate() + " " +formattedTime;
                currentData.temperature = machine.Temperature;
                console.log("last data",currentData);

                console.log("Api data",responseData.data);
                responseData.data.push(currentData);
                console.log("pushed data",responseData.data);



                var chart = c3.generate({
                    bindto: '#chart',
                    size: {
                        height: $(window).height()-350
                    },
                    data: {
                        x: 'x',
                        xFormat: '%Y-%m-%d %H:%M:%S',

                        json:responseData.data ,//genrateMachineData(),recentData,// 
                        keys: {
                            x: 'mDate', // it's possible to specify 'x' when category axis
                            value: ['temperature'],
                        },
                        type: 'bar',

                        labels:true,
                        names: {
                            temperature: 'Temperature'
                        }
                    },
                    bar: {
                        width: 10
                    },
                    zoom: {
                        enabled: true,
                        rescale: true
                    },
                    tooltip: {
                        format: {
                            title: function (x) { return formatDate(x); }
                        }
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick: {
                                fit:false,
                                // rotate: 25,
                                format: '%d-%m-%Y',
                                //format: function (x) { return x.getFullYear(); }

                            }
                        },
                        y:{
                            label: 'Temperature',
                            // min:OVER_HEAT_TEMPERATURE-65,
                        }

                    },
                    grid: {
                        y: {
                            lines: [

                                {value: OVER_HEAT_TEMPERATURE, text: 'Temperature '+OVER_HEAT_TEMPERATURE, position: 'middle', class: 'gridAvg'}

                            ]
                        }
                    }
                });
                scope.isChartLoading = false;
                scope.showGraph = true;

            })


        }
    }


}

function RightCtrl($scope, $timeout, $mdSidenav, $log,$http,$interval) {
    $scope.useCases = SIMULATOR_USE_CASES;
    $scope.simulator = {};
    $scope.simulator.MACHINE = "";
    $scope.simulator.DURATIONFORDATA ="";
    $scope.simulator.USECASE ={};
    $scope.simulator.statusString = "Run";
    $scope.simulator.runningStatus = false;
    $scope.simulator.inProgress  = false;
    $scope.successMessage = "";
    $scope.buttonStyle = "md-primary";
    $scope.run = function(data)
    {
        if($scope.simulatorForm.$valid)
        {
            $scope.simulator.inProgress  = true;


            var minute = parseInt(data.DURATIONFORDATA);
            var simulator = {};
            simulator.DURATIONFORDATA = minute * 60 * 1000;
            simulator.MACHINE = data.MACHINE;

            $scope.simulator.statusString = "Running..";
            console.log("running "+new Date(),simulator);
            $http({
                method: 'POST',
                url: SIMULATOR_BASE_URL+"/simulator/start",                    
                transformResponse: function(data){
                    return {"message":data};
                },
                data: simulator
            }).then(
                function (response) {
                    var data = response.data;
                    console.log("response",data)
                    $scope.successMessage = "IoT simulator started for "+simulator.MACHINE+" machines successfully." ;//response;
                    $scope.simulator.runningStatus = true;
                    $scope.simulator.statusString = "Stop";
                    $scope.simulator.inProgress  = false;
                    $scope.buttonStyle = "md-warn";
                    $timeout(function(){
                        $scope.toggleRight()
                    },1000);
                    // not relevant
                }, function (error) {
                    var data = error.data;
                    // not relevant
                });
            /*$http.post(,{
                    data:simulator,
                    transformResponse: [function (data){
                        var result = {"message":data};
                        return result;
                    }]}.then(function(response){
                    console.log(response);

                });*/

        }
        else{
            console.log("not valid")
        }

    }
    $scope.stop = function(simulator){
        console.log("stoping "+new Date(),data);
        $scope.simulator.statusString = "Stopping..";
        $http({
            method: 'POST',
            url: SIMULATOR_BASE_URL+"/simulator/stop",                    
            transformResponse: function(data){
                return {"message":data};
            },
            data: simulator
        }).then(
            function (response) {
                var data = response.data;
                console.log("response",data)
                $scope.successMessage = "IoT simulator stopped successfully." ;//response;
                $scope.simulator.runningStatus = false;
                $scope.simulator.statusString = "Run";
                $scope.simulator.inProgress  = false;
                $scope.buttonStyle = "md-primary";
                 $interval.cancel( $rootScope.updatePromise);   
                $timeout(function(){
                    $scope.toggleRight()
                },1000);
                // not relevant
            }, function (error) {
                var data = error.data;
                // not relevant
            });
    }
    $scope.close = function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('right').close()
            .then(function () {
            $log.debug("close RIGHT is done");
        });
    };
}

AppCtrl.$inject = ['$scope', '$location', '$timeout', '$mdSidenav', '$log', '$mdTheming', '$mdColorPalette', '$mdColors', '$mdColorUtil', '$mdMedia', '$filter', '$anchorScroll', 'Load_document', '$rootScope','$mdDialog','$localStorage'];
function AppCtrl($scope, $location, $timeout, $mdSidenav, $log, $mdTheming, $mdColorPalette, $mdColors, $mdColorUtil, $mdMedia, $filter, $anchorScroll, Load_document, $rootScope,$mdDialog,$localStorage) {
 
    $scope.doLogout = function(){
        $localStorage.isLoggedIn = false;
        showLogin();
    }
    $scope.user = {};
    $scope.isInvalid = false;
   /* if(!$localStorage.isLoggedIn)
        showLogin();*/
        function showLogin(){
    $mdDialog.show({
            controller: function($mdDialog,$scope){
                $scope.doLogin = function(){
                    if($scope.user.name == USER_EMAIL && $scope.user.password == USER_PASSWORD){
                    $localStorage.isLoggedIn = true;
                        $mdDialog.cancel();
                        $scope.isInvalid = false;
                    }
                    else{
                        $scope.isInvalid = true;
                    }
                     
                    // $mdDialog.hide();
                }
                $scope.machine = {};
                $scope.titleText = "Last 7 days alerts for machine ";
                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };
            },
            templateUrl: 'app/login/login.html',
            parent: angular.element(document.body),
            targetEvent:event,   
            animation:undefined,
            clickOutsideToClose:false,
           
            onComplete:afterShowAnimation,
            fullscreen: true // Only for -xs, -sm breakpoints.
        });
        }
    function afterShowAnimation(scope, element, options) {
        console.log("done")
    }
    $rootScope.isRealTime = false;
    $scope.user = {};
    $scope.user.Online = false;
    $scope.Show_Notification = false;
    $scope.Show_User_Profile = false;
    $scope.Show_Notification_Click = function () {
        $scope.Show_Notification = !$scope.Show_Notification;
    }
    $scope.Show_User_Profile_Click = function (ev) {
        $scope.Show_User_Profile = !$scope.Show_User_Profile;
    }
    $scope.Notification_Click = function (val) {
        $timeout(function () { $scope.Notifications[val].Seen = true; }, 200)

    }


    $scope.formatDate = function (date) {
        $scope.today = new Date();
        var diff = $filter('date')($scope.today - date, 'dd');
        if (diff == 1) {
            $scope.PrevDate = "Today"
        }
        else if (diff == 2) {
            $scope.PrevDate = "Yesterday"
        }
        else if (diff > 2 && diff < 5) {
            $scope.PrevDate = $filter('date')(date, 'EEEE');
        }
        else {
            $scope.PrevDate = $filter('date')(date, 'fullDate');
        }
        if ($scope.retDate != $scope.PrevDate) {
            $scope.retDate = $scope.PrevDate;
            return $scope.PrevDate;
        }
        else {
            return null;
        }
    };
    $scope.primary = 'blue';
    $scope.accent = 'green';
    $scope.colors = Object.keys($mdColorPalette);
    $scope.isPinned = false;
    $scope.$watch(function () { return $mdMedia('xs'); }, function (bool) {
        $scope.screen = bool;
        if (bool)
            $scope.isPinned = false;
        else {
            $scope.isPinned = false;
            $scope.myStyle = { width: '100%' };
        }
    });

    $scope.lock = function () {
        $timeout(function () {
            $mdSidenav('left').close()
            $scope.isPinned = !$scope.isPinned;
            $mdSidenav('left').open();
            if ($scope.isPinned)
                $scope.myStyle = { width: '88px' };
            else
                $scope.myStyle = { width: '100%' };
        }, 200);

    }
    $scope.getColor = function (color) {
        return $mdColorUtil.rgbaToHex($mdColors.getThemeColor(color))
    };
    $scope.selectThemePrimary = function (color) {
        $scope.primary = color;
    };
    $scope.selectThemeAccent = function (color) {
        $scope.accent = color;
    };
    $mdTheming.generateTheme('altTheme');
    $mdTheming.generateTheme('altTheme2');
    $mdTheming.generateTheme('primary');
    var route = $location.path().split("/")[1] || null;
    if (route)
        $scope.currentNavItem = route;
    else
        $scope.currentNavItem = 'view1';
    $scope.goToPerson = function (person, ev) {
        $scope.toggleRight2();
        //element[0].scrollTop = element[0].scrollHeight + 10;
        var elmnt = document.getElementById("chatBox");
        elmnt.scrollTop = 500;
        $scope.Chat_Person = person;
    };
    $scope.Back_To_Chat = function () {
        $scope.toggleRight2();
    }
    $scope.Send_message = function (mesg) {
        if (mesg) {
            $scope.my_message = null;
            $scope.Chat_Person.messages.push({ msg: mesg, Time: $filter('date')(new Date(), 'hh.mm a'), From: "me", Date: new Date() });
        }
    }
    $scope.toggleRight2 = buildDelayedToggler('right2');
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function () {
        return $mdSidenav('right').isOpen();
    };
    $scope.Link = function (path) {
        $location.path(path);
    };

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
        var timer;

        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function () {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
        return debounce(function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                $log.debug("toggle " + navID + " is done");
            });
        }, 200);
    }

    function buildToggler(navID) {
        return function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                $log.debug("toggle " + navID + " is done");
            });
        }
    }


}
