angular.module('tipti.tinder', []).service('Tinder', ['$q', '$ionicPlatform', '$rootScope', '$http', '$localForage', 'Config', function($q, $rootScope, $http, $localForage, Config) {
    var DEBUG = false;

    var self = {

        list: function(page) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/tinderlist/?page=" + page;

            $http.get(url).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        like: function(card) {

        },
        dislike: function(card) {

        }

    };

    return self;
}]);
