

'use strict';
// module definition, this has to be included in your app
angular.module('angular-c3-simple', [])


angular.module('myApp.view1', ['ngRoute', 'dataGrid', 'pagination'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            //use  templateUrl: 'view2/view2.html', in local
            templateUrl: 'app/view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])
    .service('Load_document', ['$rootScope', function () {
        var service = {
            Start: Start,
            Stop: Stop
        };
        return service

        function Start($rootScope) { $rootScope.Load_Document = true; }
        function Stop($rootScope) { $rootScope.Load_Document = false; }
    }])


    .controller('View1Ctrl', ['$scope',  '$timeout', 'Load_document', '$rootScope','myAppFactory','$mdDialog','$window','$http', function ($scope,  $timeout, Load_document, $rootScope,  myAppFactory,$mdDialog,$window,$http,$element) {
        $scope.isOrderClicked = false;
        // $scope.selectedrow = {};
       // $scope.selectedtrailerow = {};
        $scope.showTrailers = function(item){
            $scope.isOrderClicked = true;
            $scope.selectedOrderId = item.order;
             myAppFactory.getAvailableTrailers().then(function(responseData) {
            $scope.isAdhocReportLoading = false;
           $scope.gridOptions2.data = JSON.parse(JSON.stringify(responseData.data));//responseData.data;
          

        }).then(function(error) {
            console.log(error)
        })
            $scope.selectedOrder = item.order;
            $scope.selectedrow=item;
           console.log($scope.selectedrow);
            
        }
        $scope.doAllocate = function(item){
            $scope.selectedtrailerow = item;
            $scope.selectedTrailerId = item.trailerId;
            item.selectedtClass="selectedtClass"
        }
        
        $scope.allocate = function(){
            alert("Trailer id: "+$scope.selectedtrailerow.trailerId +" Allocated to order id: "+$scope.selectedrow.order);
            $scope.isOrderClicked = false;
              listTheOrders();
            
        }
        $rootScope.isRealTime = false;
        $scope.isAdhocReportLoading = false;
        $scope.gridOptions = {
            data: [],
            urlSync: false
        };
         $scope.gridOptions2 = {
            data: [],
            urlSync: false
        };
        $scope.isAdhocReportLoading = true;
        function resetSelectedRows(){
            $scope.selectedTrailerId = "";
            $scope.selectedOrderId = "";
        }
        function listTheOrders(){
            resetSelectedRows();
            myAppFactory.getListOfOrders().then(function(responseData) {
            $scope.isAdhocReportLoading = false;
           $scope.gridOptions.data = JSON.parse(JSON.stringify(responseData.data));//responseData.data;
           

        }).then(function(error) {
            console.log(error)
        })
        }
        listTheOrders();
        $rootScope.recentAlerts = [];

        Load_document.Start($rootScope);
        var geodecoder = new google.maps.Geocoder();
        var DELAY_TIMER = 1500;
        var DELAY_INCREASE_INTERVAL = 500;
        function DialogController($scope, $mdDialog,machine) {
            $scope.machine = machine;
            $scope.titleText = "Maintenance " +machine.status +" for machine "+machine.rowid;


            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };

        }
        $scope.showDetail  = function(ev,machine){
            $scope.showGraph = false;
            console.log(machine);
            $rootScope.isChartLoading = true;
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/view1/machineDetail.html',
                parent: angular.element(document.body),
                targetEvent: ev,   
                animation:undefined,
                clickOutsideToClose:true,
                locals: { machine: machine },
                onComplete:afterShowAnimation,
                fullscreen: false // Only for -xs, -sm breakpoints.
            });
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            function genrateMachineData(){
                var days = [];

                var s = new Date('2017-01-01');
                var e = new Date('2017-01-30');
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

                        dt.setMinutes(dt.getMinutes() + 50);
                        var machine = {};
                        machine.date = angular.copy(dt);
                        machine.temprature = getRandomInt(150,200);
                        machine.engineNoise = getRandomInt(70,100);
                        days.push(machine); 
                    }


                }
                console.log("datapoints ",days.length)

                return days;


            }
            function afterShowAnimation(scope, element, options) {
                // post-show code here: DOM element focus, etc.
                scope.isChartLoading = true;
                myAppFactory.getMachineData(machine).then(function(response) {
                    scope.isChartLoading = false;
                    console.log("machine for",machine);
                    console.log("machine.ndata",response.data);

                    var chart = c3.generate({
                        bindto: '#chart',
                       size: {
                        height: $(window).height()-350
                    },
                        data: {
                            x: 'x',
                            xFormat: '%Y-%m-%d %H:%M:%S',
                            json:response.data,//genrateMachineData(),sampleData,//
                            keys: {
                                x: 'mDate', // it's possible to specify 'x' when category axis
                                value: ['temperature', 'noise'],
                            },
                            /* axes: {
                                "noise": 'y2'
                            },*/
                            type: 'spline',
                            //labels:true,
                            names: {
                                temperature: 'Temperature',
                                noise: 'Noise'
                            }
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
                                    //rotate: 25,                                   
                                    format: '%d-%m-%Y'
                                }
                            },
                            /*y:{
                                min:10,
                                label: 'Temperature'
                            },
                            y2: {
                                show: false,
                                min:10,
                                label: 'Engine Noise'
                            }*/
                        },
                        grid: {
                            y: {
                                lines: getRangeLines(machine.statusVal)
                            }
                        }
                    });
                    scope.showGraph = true;

                })


            }

        }
        $scope.decode = function(machines,index){     
            if(machines.length == index){
                return false;
            }
            var machine = machines[index];

            machine.decoded = !machine.decoded;
            if(machine.decoded){
                machine.geoCode = "Processing.."
                var lat = parseFloat(machine.latitude);
                var lng = parseFloat(machine.longitude);
                var latlng = new google.maps.LatLng(lat, lng);
                console.log("tryingg.. ",machine.rowid,"index--"+index,"ON every "+DELAY_TIMER);
                geodecoder.geocode({'latLng': latlng}, function(results, status)
                                   {
                    if (status == google.maps.GeocoderStatus.OK)
                    {
                        if (results[0])
                        {

                            console.log("decoding..",machine.rowid);
                            machine.geoCode = results[0].formatted_address.replace(/^Unnamed Road,+/i, '');
                            $scope.$apply();
                            if(index < machines.length)
                            {

                                $timeout(function(){$scope.decode(machines,index+1)},DELAY_TIMER);
                            }
                        }

                    }
                    else if (status ==  google.maps.GeocoderStatus.ZERO_RESULTS  ) {
                        console.log("status",status);
                        console.log("results",results);
                        machine.geoCode = machine.latitude+","+machine.longitude;
                        $scope.$apply();
                        if(index < machines.length)
                        {

                            $timeout(function(){$scope.decode(machines,index+1)},DELAY_TIMER);
                        }
                    }
                    else{
                        console.log("status",status);
                        machine.geoCode = "Retrying..";
                        if(index < machines.length )
                        {
                            console.log("retriying..",machine.machineId,"index--"+index);
                            DELAY_TIMER += DELAY_INCREASE_INTERVAL;
                            console.log("retriying..",machine.machineId,"index--"+index,"ON every "+DELAY_TIMER);
                            $timeout(function(){$scope.decode(machines,index+1)},DELAY_TIMER);

                        }
                    }
                });
            }

        }
        $scope.Change = true;


        $timeout(function () { Load_document.Stop($rootScope); }, 1500)

    }]);
