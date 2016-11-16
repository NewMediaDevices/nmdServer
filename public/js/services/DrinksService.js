
// public/js/services/NerdService.js
angular.module('DrinksService', []).factory('Drinks', ['$http', function($http) {

    return {

        getAllToday : function() {
            return $http.get('/api/drink?token=temp');
        },

    }

}]);
