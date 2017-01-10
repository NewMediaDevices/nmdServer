// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/drinks', {
          templateUrl: 'views/drinks.html',
          controller: 'AppDrinksController'
        })
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        });


    $locationProvider.html5Mode(true);

}]);
