'use strict';
angular.module('myApp.login', ['ngRoute','vsGoogleAutocomplete'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            //use  templateUrl: 'view2/view2.html', in local
            templateUrl: 'app/login/login.html',
            controller: 'LoginCtrl'
        });
    }])
  
    .controller('LoginCtrl', [ '$scope', function ( $scope) {
         $scope.user = { 
      name : "Naomi Black",
      password: ""
    }  
    }]);

