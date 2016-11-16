// public/js/controllers/MainCtrl.js
angular.module('mainController', []).controller('MainController', [ '$scope', 'Location', function($scope, Location) {

    $scope.tagline = 'To the moon and back!';

    // $scope.locations = Location.getAllToday(function (err, data) {
    //   console.log(data);
    // });

    Location.getAllToday()
    .then(function(success){
      console.log(success);
      $scope.locations = success.data;
    }, function(err){
      console.log(err);
    });



}]);
