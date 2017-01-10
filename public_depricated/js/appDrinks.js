// public/js/appRoutes.js
angular.module('appDrinks', [])
// Define Secret Message service
// Injecting $scope and SecretMessage as dependecies of this controler
.controller('AppDrinksController', [ '$scope', 'Drinks', function($scope, Drinks) {
  Drinks.getAllToday()
  .then(function(success){
    console.log(success);
    $scope.drinks = success.data;
  }, function(err){
    console.log(err);
  });
}]);

// bootstraping the app
angular.element(document).ready(function() {
  angular.bootstrap(document, ['appDrinks']);
});
