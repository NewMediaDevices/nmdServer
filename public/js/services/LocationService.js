// public/js/services/NerdService.js
angular.module('LocationService', []).factory('Location', ['$http', function($http) {

    return {
        // call to get all nerds
        get : function() {
            return $http.get('/api/location?token=temp');
        },
        getAllToday : function() {
            return $http.get('/api/locationsToday?token=temp');
        },

        // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
        create : function(locationData) {
            return $http.post('/api/location', locationData);
        },

        /*call to DELETE a nerd
        delete : function(id) {
            return $http.delete('/api/loca/' + id);
        }
        */
    }

}]);
