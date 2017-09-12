angular.module('tipti.geoposition', [])
    .service('GeoPosition', function ($q, $rootScope, $http, $ionicPlatform, $cordovaGeolocation, Retailer, User,Util) {

        var self = {

            watch: function () {

                var options = {
                    timeout: 30000,
                    maximumAge: 10000,
                    enableHighAccuracy: true
                };

                var latest_position_timestamp;
                var latest_position_accuracy;

                $ionicPlatform.ready(function () {
                    $cordovaGeolocation.watchPosition(options).then(
                        null,
                        function (err) {
                            console.error(err);
                            User.getUser().then(function(user){
                                Retailer.list("-0.180965", "-78.445108");
                            });
                        },
                        function (position) {
                            $rootScope.position = position;

                            if(!latest_position_timestamp){
                                User.getUser().then(function(user){
                                    Retailer.list(position.coords.latitude, position.coords.longitude);
                                });
                            }


                            if (!latest_position_timestamp || (position.timestamp - latest_position_timestamp) > options.maximumAge || latest_position_accuracy > position.coords.accuracy) {

                                latest_position_timestamp = position.timestamp;
                                latest_position_accuracy = position.coords.accuracy;

                                self.getAddressOf(position.coords.latitude, position.coords.longitude).then(function (location) {
                                    console.log($rootScope.current_address);
                                    if ($rootScope.current_address === undefined) {
                                        $rootScope.current_address = location[0].formatted_address;
                                    }
                                }, function (error) {
                                    console.error(error);
                                    if (!window.cordova) {
                                        Retailer.list("-0.180965", "-78.445108").then(function (retailers) {
                                            $rootScope.retailers = retailers;
                                        });
                                        Util.getAddressOf("-0.180965", "-78.445108").then(function (location) {
                                            console.log($rootScope.current_address);
                                            if ($rootScope.current_address === undefined) {
                                                $rootScope.current_address = location[0].formatted_address;
                                            }
                                        }, function (error) {
                                            console.error(error);
                                        });
                                    }
                                });
                            } else {
                                console.info("position menos de 10 seg, skipping...");
                            }

                        }
                    );
                });
            },
            getAddressOf: function (lat, lng) {

                /*var deferred = $q.defer();
                var url = Config.serverUrl() + "/reverse_geocode/";


                $http.post(url, {
                    'lat': lat,
                    'lng': lng,
                    'device': $rootScope.device
                }).then(function(responseData) {
                    console.info(responseData);
                    deferred.resolve(responseData.data);

                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;*/
                var deferred = $q.defer();

                if(lat === undefined || lng === undefined){
                    deferred.reject();
                }

                var url = "http://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + lng + "&zoom=18&addressdetails=1";
                $http({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Authorization': undefined
                    }
                }).then(function (responseData) {
                    var response = [];
                    response.push({
                        'formatted_address': responseData.data.display_name
                    });
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            getCurrentAddress: function () {
                var deferred = $q.defer();

                self.getAddressOf($rootScope.position.coords.latitude, $rootScope.position.coords.longitude).then(function (address) {

                    deferred.resolve(address);
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            },
            getGeocodeOf: function (address) {

                var deferred = $q.defer();

                var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address;
                $http({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Authorization': undefined
                    }
                }).then(function (responseData) {
                    deferred.resolve(responseData.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
        };

        return self;
    });
