'use strict';
angular.module('myApp.trailerPool', ['ngRoute', 'vsGoogleAutocomplete', 'dataGrid', 'pagination'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/trailerPool', {
            //use  templateUrl: 'view2/view2.html', in local
            templateUrl: 'app/trailerPool/trailerPool.html',
            controller: 'trailerPoolCtrl'
        });
    }])

    .controller('trailerPoolCtrl', ['$scope', '$http', '$mdToast', '$interval', '$rootScope', '$mdDialog', 'myAppFactory', function ($scope, $http, $mdToast, $interval, $rootScope, $mdDialog, myAppFactory) {
        $scope.viewFlag = "1";
        $scope.okMessage = "Message";
        function DialogController($scope, $mdDialog, machine,message) {
            $scope.machine = machine;

            myAppFactory.getTrailerHistoryData().then(function (response) {
                console.log("response", response.data);
                $scope.machine.histories = response.data;
            }).then(function (response) {})
            console.log("machine", machine);
            $scope.selection = "trailer";



            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {

                var confirm = $mdDialog.alert()
                .title(message)             
                .ariaLabel('Lucky day')
                // .targetEvent(ev)
                .ok('Ok');
                $mdDialog.show(confirm);


            };

        }
        $scope.gridOptions = {};

        $scope.gridOptions2 = {
            data: [],
            urlSync: false
        };
        $scope.gridOptions3 = {
            data: [],
            urlSync: false
        };

        $scope.selection = "truck";
        $scope.toShowVariance = true;
        $scope.toShowRelocate = function (item) {

            $scope.toShowVariance = false;
            $scope.selectedPool=item;
            $scope.selectOrder();
        }

        $scope.viewSelect = function (item) {
            //alert(item + " " + $scope.viewFlag);
            console.log($scope.gridOptions.data)
            $scope.viewFlag = item;
            if (item =="0") {
                angular.forEach($scope.gridOptions.data, function (data) {
                    if(data.variance==0){
                        data.show=true;
                    }else{
                        data.show=false;
                    }
                });

            } else if (item == "1") {
                angular.forEach($scope.gridOptions.data, function (data) {
                    if(data.variance>0){
                        data.show=true;
                    }else{
                        data.show=false;
                    }
                });

            } else if (item == "-1") {
                angular.forEach($scope.gridOptions.data, function (data) {

                    data.show=true;

                });

            }

        };

        $scope.viewSelect("1");

        $scope.order2 = {
            "isChecked": true,
            "status": "Available",
            "order": "2343443",
            "orderDateTime": "05-20-2017 08:30",
            "orginName": "Chattanooga ",
            "billToName": "Walmart",
            "origin": {
                "name": "Atlanta,GA",
                "Latitude": 33.7489954,
                "Longitude": -84.3879824
            },
            "destination": {
                "name": "Buford,GA",
                "Latitude": 34.1206564,
                "Longitude": -84.0043513
            },
            "service": "SOLO",
            "tracktor": "",
            "trailer": "",
            "ref": "2342345",
            "reftype": "SID",
            "orderremark": "all set",
            "details": "more info"
        };

        $scope.selectTruck = function(truck){

            $scope.selectedTruck = truck;
            $scope.selection = "trailer";
            //showWizard('trailer');
            myAppFactory.getAvailableTrailers().then(function(responseData) {
                $scope.isAdhocReportLoading = false;
                $scope.gridOptions3.data = JSON.parse(JSON.stringify(responseData.data));//responseData.data;


            }).then(function(error) {
                console.log(error)
            })

        };

        $scope.selectTrailer = function(trailer){
            $scope.selectedTrailer = trailer;
            $scope.selection="summary";
            //showWizard('summary');
        };
        $scope.allocate = function(ev){

            var confirm = $mdDialog.alert()
            .title('Trailer reposition initiated successfully.')             
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Ok');
            $mdDialog.show(confirm).then(function(){
                $scope.toShowVariance = true;
            });


        };
        $scope.cancleAllocation = function(){
            $scope.selection="truck";
            $scope.toShowVariance=true;
        };


        $scope.selectOrder = function (order) {
            order = $scope.order2;
            $scope.selectedOrder = order;

            //order selected next find the truck and show the resluts

            //showWizard('truck');
            myAppFactory.getAvailableTrucks().then(function (responseData) {
                $scope.isAdhocReportLoading = false;
                $scope.gridOptions2.data = JSON.parse(JSON.stringify(responseData.data)); //responseData.data;
                var position = new google.maps.LatLng(order.origin.Latitude, order.origin.Longitude)
                orderMaker.setPosition(position);
                tkmapa.panTo(position);
                tkmapa.setCenter(position);
                orderCircle.bindTo('center', orderMaker, 'position');
                orderCircle.setRadius(1609.34 * $scope.filter.miles);
                orderStartCircle.setCenter(position);

            }).then(function (error) {
                console.log(error)
            })


        };


        $scope.gridOptions.data = [{
            state: "AL",
            city: "Birmingham",
            csr: "Mike",
            planner: "Mike",
            company: "Valspar",
            reqPool: "1",
            curr: "1",
            variance: 0,
            twm: "VALBIRG02",
            totReq: "1",
            show: true

        }, {
            state: "AL",
            city: "Birmingham",
            csr: "Kevin",
            planner: "DANNY",
            company: "Averitt",
            reqPool: "2",
            curr: "1",
            variance: 1,
            twm: "AVEBIR",
            totReq: "2"

        }, {
            state: "AL",
            city: "Cullman",
            csr: "Sarah",
            planner: "DANNY",
            company: "Serta",
            reqPool: "4",
            curr: "1",
            variance: 3,
            twm: "SERCUL02",
            totReq: "4"

        }, {
            state: "AL",
            city: "Gentry",
            csr: "David",
            planner: "Molly",
            company: "Walmart 6008",
            reqPool: "6",
            curr: "2",
            variance: 4,
            twm: "MCK",
            totReq: "6"

        }, {
            state: "AR",
            city: "North Little Rock",
            csr: "Mike",
            planner: "Mike",
            company: "Valspar",
            reqPool: "10",
            curr: "5",
            variance: 5,
            twm: "VALBIRG02",
            totReq: "10"

        }, {
            state: "AZ",
            city: "Phoenix",
            csr: "Mike",
            planner: "Mike",
            company: "Valspar",
            reqPool: "13",
            curr: "1",
            variance: 12,
            twm: "VALBIRG02",
            totReq: "13"

        }, {
            state: "AL",
            city: "Birmingham",
            csr: "Mike",
            planner: "Mike",
            company: "Valspar",
            reqPool: "11",
            curr: "2",
            variance: 9,
            twm: "VALBIRG02",
            totReq: "11"

        }, ];
        $scope.viewSelect($scope.viewFlag);
        $rootScope.doReposition = function (trailerID) {
            $scope.showGraph = false;
           
            console.log(trailerID);
            var resultTrailer = _.find($scope.tractorData, function (x) {
                return x.TrailerID === trailerID;
            });
            console.log(resultTrailer);
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/trailerPool/repositionInfo.html',
                parent: angular.element(document.body),

                animation: undefined,
                clickOutsideToClose: true,
                locals: {
                    machine: resultTrailer,
                    message:"Pool added successfully!"
                },
                escapeToClose: true,
                // onComplete:afterShowAnimation,
                // fullscreen: true // Only for -xs, -sm breakpoints.
            });

            function afterShowAnimation(rootScope, element, options) {
                // post-show code here: DOM element focus, etc.

                myAppFactory.getMachineData(machine).then(function (response) {


                })


            }

        }

        $rootScope.doEdit = function (trailerID) {
            $scope.showGraph = false;
           
            console.log(trailerID);
            var resultTrailer = _.find($scope.tractorData, function (x) {
                return x.TrailerID === trailerID;
            });
            console.log(resultTrailer);
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/trailerPool/EditInfo.html',
                parent: angular.element(document.body),

                animation: undefined,
                clickOutsideToClose: true,
                locals: {
                    machine: resultTrailer,
                    message:"Attribute edited successfully!"
                },
                escapeToClose: true,
                // onComplete:afterShowAnimation,
                // fullscreen: true // Only for -xs, -sm breakpoints.
            });

            function afterShowAnimation(rootScope, element, options) {
                // post-show code here: DOM element focus, etc.

                myAppFactory.getMachineData(machine).then(function (response) {


                })


            }

        }

        $rootScope.isRecentAlertLoading = true;
        $rootScope.$on('triggerMachineDetail', function (event, machine) {
            console.log("triggered", machine)

        });
        $rootScope.isRealTime = true;
        $("#map").height($(window).height() - 200);
        $(window).bind("resize", function () {

            $("#map").height($(window).height() - 200);
        })
        //InitializeComponents();
        var mapa = null;
        var machines = null;
        var geocoder;
        $scope.address = {
            name: '',
            place: '',
            components: {
                placeId: '',
                streetNumber: '',
                street: '',
                city: '',
                state: '',
                countryCode: '',
                country: '',
                postCode: '',
                district: '',
                location: {
                    lat: '',
                    long: ''
                }
            }
        };
        resetValues();
        $scope.$watch('address.place', function () {
            console.log("name", $scope.address.name);
            if ($scope.address.place.geometry) {
                console.log("palce", $scope.address.place);

                if ($scope.address.place.geometry.viewport) {
                    mapa.fitBounds($scope.address.place.geometry.viewport);
                } else {
                    mapa.setCenter($scope.address.place.geometry.location);
                    mapa.setZoom(8);
                }
            }
        });
        $scope.acOption = {
            types: ['(cities)'],
            componentRestrictions: {
                country: "us"
            }
        }
        $scope.view = {
            addressInput: '',
            places: [],
            selectedPlace: ''
        }
        $scope.findAddress = findAddress;
        $scope.focusLocation = focusLocation;
        $scope.resetZoom = function () {
            $scope.address.name = "";
            resetValues();
            $scope.filterMachines();
            mapa.setZoom(DEFAULT_ZOOM_LEVEL);
            mapa.setCenter(US_CENTER_LAT_LNG);
        }

        function findAddress() {
            console.log("lat", $scope.address.components.location.lat)
            if (geocoder !== undefined) {
                geocoder.geocode({
                    address: $scope.view.addressInput
                },
                                 function (results, status) {
                    $scope.view.places = [];
                    $scope.view.selectedPlace = '';
                    switch (status) {
                        case google.maps.GeocoderStatus.OK:
                            console.log(results);
                            $scope.view.places = results;
                            if (results.length < 2) {
                                $scope.view.selectedPlace = results[0].place_id;
                                $scope.view.addressInput = results[0].formatted_address;
                                focusLocation();
                            } else showMessage($scope.view.places.length + ' places found');
                            break;
                        case google.maps.GeocoderStatus.ZERO_RESULTS:
                            showMessage('No results found');
                            break;
                        case google.maps.GeocoderStatus.REQUEST_DENIED:
                            showMessage('The search request has been denied');
                            break;
                        case google.maps.GeocoderStatus.INVALID_REQUEST:
                            showMessage('Invalid request');
                            break;
                    }
                    $scope.$apply();
                }
                                );
            }
        }

        //Posiciona en el centro de la vista del mapa la ubicacion seleccionada
        function focusLocation() {
            if ($scope.view.selectedPlace !== undefined & $scope.view.selectedPlace !== '') {
                var location = _.result(_.find($scope.view.places, function (x) {
                    return x.place_id === $scope.view.selectedPlace;
                }), 'geometry.location');
                if (location !== undefined) {

                    mapa.setCenter(location);
                    mapa.setZoom(8);
                } else {
                    showMessage('No se pudo mostrar la ubicación');
                }
            }
        }
        $scope.initialize = function () {

            InitializeComponents();
        }
        $scope.filterMachines = function () {
            gmapService.data = filterData(machines);
            gmapService.placeMarkersOnMap(mapa);
        }
        $scope.$on('g-places-autocomplete:select', function (event, param) {
            console.log(event);
            console.log(param);
        });

        function InitializeComponents() {
            var mapConfig = {
                center: US_CENTER_LAT_LNG,
                zoom: DEFAULT_ZOOM_LEVEL,
                'mapTypeId': google.maps.MapTypeId.ROADMAP,
                fullscreenControl: true,
                mapTypeControl: false,
            };
            var clatLng = new google.maps.LatLng(
                US_CENTER_LAT_LNG.lat,
                US_CENTER_LAT_LNG.lng);

            mapa = new google.maps.Map(document.getElementById('map'), mapConfig);

            var customControlDiv = document.createElement('div');
            customControlDiv.style.marginRight = '10px';
            customControlDiv.style.width = '25px';
            var customControl = new CustomControl(customControlDiv, mapa);

            customControlDiv.index = 1;
            mapa.controls[google.maps.ControlPosition.RIGHT_TOP].push(customControlDiv);

            function CustomControl(controlDiv, map) {

                // Set CSS for the control border
                var controlUI = document.createElement('div');
                controlUI.style.backgroundColor = '#ffffff';
                controlUI.style.borderStyle = 'solid';
                controlUI.style.borderWidth = '1px';
                controlUI.style.borderColor = '#ccc';
                controlUI.style.height = '26px';
                controlUI.style.top = '5px';
                controlUI.style.marginLeft = '-6px';
                controlUI.style.paddingTop = '1px';
                controlUI.style.cursor = 'pointer';
                controlUI.style.textAlign = 'center';
                controlUI.title = 'Reset to home';
                controlDiv.appendChild(controlUI);

                // Set CSS for the control interior
                var controlText = document.createElement('div');
                controlText.style.fontFamily = 'Arial,sans-serif';
                controlText.style.fontSize = '14px';
                controlText.style.paddingLeft = '4px';
                controlText.style.paddingRight = '4px';
                controlText.style.marginTop = '2px';
                controlText.innerHTML = '<md-icon style="{color: #777}"    aria-label="accessibility" class="material-icons step"           class="md-18" >undo  </md-icon>';
                controlUI.appendChild(controlText);

                // Setup the click event listeners
                google.maps.event.addDomListener(controlUI, 'click', function () {

                    $scope.resetZoom();

                    $scope.$digest();
                });
            }
            geocoder = new google.maps.Geocoder();
            /*d3 gmap lab*/

            var myoverlay = new google.maps.OverlayView();
            /*// Add the container when the overlay is added to the map.
              myoverlay.onAdd = function() {
                var layer = d3.select(this.getPanes().overlayLayer).append("div")
                .attr("class", "stations");

                // Draw each marker as a separate SVG element.
                // We could use a single SVG, but what size would it have?
                myoverlay.draw = function() {
                    var projection = this.getProjection(),
                        padding = 10;
                    layer.select('svg').remove();
                    var w = $(window).width();
                    var h = 600;
                    var svg = layer.append("svg")
                    .attr('width', w)
                    .attr('height', h);
                    var marker = layer.selectAll("svg")
                    .attr('width', 500)
                     .attr('height', 500)
                    .data(d3.entries(statesjson))
                    .each(transform) // update existing markers
                    .enter().append("svg")
                    .attr('width', 500)
                     .attr('height', 500)
                    .each(transform)
                    .attr("class", "marker");

                    // Add a circle.
                    marker.append("circle")
                        .attr("r", 4.5)
                        .attr("cx", padding)
                        .attr("cy", padding);

                    function transform(d) {
                        d = new google.maps.LatLng(d.value[1], d.value[0]);
                        d = projection.fromLatLngToDivPixel(d);
                        var circle =  d3.select(this)
                        .attr("cx", d.x)
                        .attr("cy", d.y)
.style("left", (d.x - padding) + "px")
                       .style("top", (d.y - padding) + "px");

                        (function repeat() {
                            circle = circle.transition()
                                .duration(2000)
                                .attr("stroke-width", 50)
                                .attr("r", 0)
                                .transition()
                                .duration(2000)
                                .attr('stroke-width', 0.5)
                                .attr("r", 200)
                                .ease('sine')
                                .each("end", repeat);
                        })();
                        return circle;
                    }
                };
            };*/
            myoverlay.draw = function () {
                this.getPanes().markerLayer.id = 'markerLayer';
            };

            myoverlay.setMap(mapa);
            //gmapService.placeMarkersOnMap(mapa,data);
            //  var markerCluster = new MarkerClusterer(mapa, markers);
            $rootScope.recentAlerts = [];
            update();
            $rootScope.updatePromise = $interval(function () {
                update();
            }, REFRESHING_INTERVAL * 60 * 1000);

            $scope.$on('$destroy', function () {
                console.log("destroyedd")
                if ($rootScope.updatePromise)
                    $interval.cancel($rootScope.updatePromise);
            });

            Array.prototype.unique = function () {
                var a = this.concat();
                for (var i = 0; i < a.length; ++i) {
                    for (var j = i + 1; j < a.length; ++j) {
                        if (a[i].MachineId === a[j].MachineId)
                            a.splice(j--, 1);
                    }
                }

                return a;
            };
            $scope.tractorData = [];

            function update() {
                $.get({
                    url: GET_TRACTOR_LOCATOR_URL,
                    cache: false
                }).then(function (data) {
                    //var jsonData = JSON.parse(data);//makeAsJSON(data);
                    console.log(new Date() + "--->machine Length->", data.length);

                    gmapService.data = data;
                    $scope.tractorData = data;
                    gmapService.placeMarkersOnMap(mapa);
                    /*$rootScope.isRecentAlertLoading =  true;
                        myAppFactory.getRecentAlertData().then(function(response){
                            console.log("recent",response.data);
                            $rootScope.recentAlerts = response.data;
                            $rootScope.isRecentAlertLoading =  false;
                        }).then(function(error){
                            console.log("error",error);
                        })*/
                    /*Temp fix*/


                    $scope.$digest();




                });
            }

            /*$http.get("app/data/output.json").then(function(response){
                $scope.MachineRanges = calucateRange(response.data.length,response.data.length/10);
                machines =response.data;
                gmapService.data = filterData(machines);
                gmapService.placeMarkersOnMap(mapa);
            })*/


        }

        function filterData(data) {
            var machineStatus = $scope.machineStatus.value;
            var machineRange = $scope.machineRange.value;

            var filteredData = null;
            if (machineStatus >= 0 && machineRange == "") {
                filteredData = _.filter(data, function (obj) {

                    return obj.EngineOn == machineStatus;
                });
            } else if (machineStatus >= 0 && machineRange != "") {
                filteredData = _.filter(data, function (obj) {
                    var res = false;
                    if ((obj.EngineOn == machineStatus) && (obj.MachineId <= $scope.machineRange.max && obj.MachineId >= $scope.machineRange.min))
                        res = true
                        return res;
                });
            } else if ((machineStatus == "-1" || machineStatus == "") && machineRange != "") {
                filteredData = _.filter(data, function (obj) {
                    var res = false;
                    if ((obj.MachineId <= $scope.machineRange.max && obj.MachineId >= $scope.machineRange.min))
                        res = true
                        return res;
                });
            } else {
                filteredData = data;
            }

            console.log("Status", filteredData.length);
            return filteredData;
        }

        function getMarkerImage(engineState) {
            var imagePath = "";
            if (engineState == ENGINE_ON) {
                imagePath = "images/markers/over_heat_idle.png";
            } else {
                imagePath = "images/markers/over_heat_idle.png";
            }
            return new google.maps.MarkerImage(imagePath,
                                               new google.maps.Size(40, 40));
        }

        function calucateRange(machineLength, threshHold) {
            var machineStartingSerial = 1;
            var rangeArray = [];

            rangeArray.push({
                "value": "",
                "displayValue": "All"
            });
            while (machineStartingSerial <= machineLength) {
                var ending_serial = parseInt(machineStartingSerial) + parseInt(threshHold - 1);
                rangeArray.push({
                    "value": ending_serial,
                    "displayValue": machineStartingSerial + "--" + ending_serial,
                    min: machineStartingSerial,
                    max: ending_serial
                });
                machineStartingSerial += threshHold;
            }
            /*for(var i=machineStartingSerial;i<=machineLength;i+=threshHold){
           rangeArray.push({"value":i,"displayValue":i + "-" + i+threshHold});
       }*/
            return rangeArray;
        }

        function resetValues() {
            $scope.machineStatus = {
                "name": "All",
                "value": -1
            };
            $scope.machineRange = {
                "value": ""
            };
            $scope.MachineStatuses = [{
                "name": "All",
                "value": -1
            }, {
                "name": "Idle",
                "value": 0
            }, {
                "name": "Running",
                "value": 1
            }];
        }

        $scope.MachineRanges = calucateRange(1000, 10);

        function update() {
            console.log("Updating..");
            var url = "app/data/simulator.json";
            /* d3.json(url,function(error,data){
                if(error)
                    console.log("data",error)

                   console.log("encoded data",data);
        var output= parseHBaseRest(data,"MachineID");
        console.log("decodeData",output);
           $scope.data = data;     
                $scope.showMarkers();
                console.log(new Date()+"--->machine Length->",data.length);

            })*/
            $.get('data/StreamingData/part-00000', function (data) {

                var jsonData = makeAsJSON(data);
                console.log(Date.now() + "--0->machine Length->", jsonData.length);
                var threshold = parseInt(jsonData.length / 10);

                $scope.MachineRanges = calucateRange(jsonData.length, threshold);
                $scope.data = makeAsJSON(data);
                $scope.showMarkers();

            });

            /* d3.json("data/output.json", function(error, machineData) {
        if(error)
            console.log(error);
        //console.log("machine",machineData);
        machineNRT.data = machineData;     
        machineNRT.showMarkers();
    });*/
            /* d3.csv("data/sample.csv", function(error, machineData) {
        if(error)
            console.log(error);
        //console.log("machine",machineData);
        machineNRT.data = machineData;     
        machineNRT.showMarkers();
    });*/
        }

        function replaceAll(str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        }

        function makeAsJSON(data) {
            var addedCommaData = replaceAll(data, "}", "},");
            var part1 = addedCommaData.trim().substring(0, addedCommaData.length - 2);
            var result = "[" + part1 + "]";
            var jssonArray = JSON.parse(result);
            return jssonArray;


        }
        //Muestra un mensaje toast (funcion base)
        function simpleToastBase(message, position, delay, action) {
            /*$mdToast.show(
                $mdToast.simple()
                .content(message)
                .position(position)
                .hideDelay(delay)
                .action(action)
            );*/
        }

        //Muestra un mensaje toast
        function showMessage(message) {
            console.log(message);
        }
    }]);
