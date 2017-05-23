

'use strict';
// module definition, this has to be included in your app
angular.module('angular-c3-simple', [])


angular.module('myApp.allocation', ['ngRoute', 'dataGrid', 'pagination'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/allocation', {
            //use  templateUrl: 'view2/view2.html', in local
            templateUrl: 'app/allocation/allocation.html',
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
        $scope.showHistory = function(trailer){
            console.log("history");
            $scope.showDetail(trailer);
        }
        $scope.showTrailers = function(item){
            console.log("asdf");
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
            $scope.selectedTrailerId = item.TrailerID;
            item.selectedtClass="selectedtClass"
        }

        $scope.allocate = function(){
            // alert("Trailer id: "+$scope.selectedtrailerow.trailerId +" Allocated to order id: "+$scope.selectedrow.order);
            $scope.showConfirm(this,"Trailer id: "+$scope.selectedtrailerow.TrailerID +" will map to Order id: "+$scope.selectedrow.order);
            //  $scope.isOrderClicked = false;
            // listTheOrders();

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
            console.log("mmm",machine);
            $scope.histories = [ {
                "OrderStatus": "Completed",
                "OrderID": 2709536,
                "OriginName": "Covenant Transport",
                "OriginCity": "Colorado County",
                "DestinationCity": "Oklahoma",
                "BillToName": "MCKEE FOODS",
                "StartDate": "05/21/2017 10:52:00",
                "EndDate": "05/23/2017 9:52:00"
            },
                                {
                                    "OrderStatus": "Completed",
                                    "OrderID": 2738750,
                                    "OriginName": "Calhoun",
                                    "OriginCity": "McKinley County",
                                    "DestinationCity": "Graham County",
                                    "BillToName": "WALMART PRODUCT",
                                    "StartDate": "05/14/2017 09:32:01",
                                    "EndDate": "05/17/2017 09:32:01"
                                },
                                {
                                    "OrderStatus": "Completed",
                                    "OrderID": 2744211,
                                    "OriginName": "Covenant Transport",
                                    "OriginCity": "Maricopa County",
                                    "DestinationCity": "San Bernardino County",
                                    "BillToName": "CIRCLE 8 LOGISTICS",
                                    "StartDate": "04/24/2017 06:27:02",
                                    "EndDate": "04/28/2017 06:27:02"
                                },
                                {
                                    "OrderStatus": "Completed",
                                    "OrderID": 2743233,
                                    "OriginName": "Covenant Transport",
                                    "OriginCity": "Ohio",
                                    "DestinationCity": "Illinois",
                                    "BillToName": "VHI TRANSPORTS",
                                    "StartDate": "04/18/2017 12:56:03",
                                    "EndDate": "04/21/2017 12:56:03"
                                },
                                {
                                    "OrderStatus": "Completed",
                                    "OrderID": 2751411,
                                    "OriginName": "Calhoun",
                                    "OriginCity": "Delaware County",
                                    "DestinationCity": "West Virginia",
                                    "BillToName": "VHI TRANSPORTS",
                                    "StartDate": "04/13/2017 12:56:03",
                                    "EndDate": "04/16/2017 12:56:03"
                                }];
            $scope.titleText = "Maintenance ";
            $scope.detaileData = [{"orderID":"","trailerId":"1234","tracktor":"33331","destinationcity":"Ontoria OH","service":"TEAM"},
                                  {"status":"Completed","orderID":"","trailerId":"1235","tracktor":"33332","destinationcity":"BUFORD,GA","service":"TEAM"},
                                  {"status":"Completed","orderID":"","trailerId":"1236","tracktor":"33333","destinationcity":"BUFORD,GA","service":"TEAM"}];

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
        $scope.showConfirm = function(ev,message) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
            .title('Would you like to allocate this trailler?')
            .textContent(message)
            .ariaLabel('Trailer Allocation')
            //.targetEvent(ev)
            .ok('allocate')
            .cancel('cancel');

            $mdDialog.show(confirm).then(function() {
                //allocate process
                console.log("orders summary")
                $mdDialog.show({
                controller: function($scope){
                    $scope.cancel = function(){
                        $mdDialog.cancel();
                    }
                },
                templateUrl: 'app/allocation/allocatedSummary.html',
                parent: angular.element(document.body),
                // targetEvent: ev,   
                //  animation:undefined,
                clickOutsideToClose:true,                
                escapeToClose: true,
                //  onComplete:afterShowAnimation,
                //fullscreen: false // Only for -xs, -sm breakpoints.
            });
               /* $mdDialog.show(
                    $mdDialog.alert()
                  //  .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Allocation Status')
                    .textContent('Your allocation done succesfully!')
                    .ariaLabel('Allocation Status')
                    
                    .targetEvent(ev)
                );
*/
            }, function() {
                //cancel the allocation;
            });
        };

        $scope.showDetail  = function(machine){
            $scope.showGraph = false;

            $rootScope.isChartLoading = true;
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/allocation/trailerHistory.html',
                parent: angular.element(document.body),
                // targetEvent: ev,   
                //  animation:undefined,
                clickOutsideToClose:true,
                locals: { machine: machine },
                escapeToClose: true,
                //  onComplete:afterShowAnimation,
                //fullscreen: false // Only for -xs, -sm breakpoints.
            });


        }
        // $scope.showDetail();
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
