angular.module('tipti.retailer', [])
    .service('Retailer', function ($q, $rootScope, $http) {
            var active_retailer = null;
            var retailers = [];

            var self = {

                list_city: function() {
                    var deferred = $q.defer();

                    var url = "https://tipti.ec/misuper/cities/";

                    $http.get(url).then(function (response) {
                        console.group("Ciudades.list");
                        console.log(response.data);
                        console.groupEnd();
                        $rootScope.ciudades = response.data.results;

                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },
                
                list_sector: function(id_city) {
                    var url = "https://tipti.ec/misuper/sectors_city/"+id_city+"/";

                    var deferred = $q.defer();

                    $http.get(url).then(function(response) {
                        console.log("Sectores info");
                        console.log(response.data);
                        deferred.resolve(response.data);

                    }, function(error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                }

            };

            return self;
        }
    );

