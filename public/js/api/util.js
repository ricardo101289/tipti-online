angular.module('tipti.util', []).service('Util', ['$q', '$ionicPlatform', '$rootScope', '$http', '$localForage', 'Config', function($q, $rootScope, $ionicPlatform, $http, $localForage, Config) {
    var DEBUG = false;
    var units = {
        'U': 'Unidad',
        'G': 'Gramo',
        'KG': 'Kilo',
        'ML': 'Mililitro',
        'L': 'Litro',
        'LB': 'Libra',
        'ATADO':'Atado'

    };

    var units_plural = {
        'U': 'Unidades',
        'G': 'Gramos',
        'KG': 'Kilos',
        'ML': 'Mililitros',
        'L': 'Litros',
        'LB': 'Libras',
        'ATADO':'Atados'
    };

    var self = {

        checkCertificate: function() {
            var deferred = $q.defer();

            if (window.plugins !== undefined) {

                var server = "https://misuper.ec";
                var fingerprint = "84 D0 F2 4A B6 EB 74 DC 07 49 7D 9F 00 A9 78 A4 99 05 3D AB";

                window.plugins.sslCertificateChecker.check(
                    function(message) {
                        deferred.resolve(message);
                    },
                    function(error_message) {
                        if (error_message == "CONNECTION_NOT_SECURE") {
                            // There is likely a man in the middle attack going on, be careful!
                            deferred.reject(error_message);
                        } else if (error_message.indexOf("CONNECTION_FAILED") > -1) {
                            deferred.reject(error_message);
                        }
                    },
                    server,
                    fingerprint
                );

            } else {
                deferred.resolve("");
            }
            return deferred.promise;
        },
        formatUnitQuantity: function(unit, quantity) {
            quantity = parseFloat(quantity);

            if(quantity === 1)
                return quantity+" "+units[unit];
            else
                return quantity+" "+units_plural[unit];

        }

    };



    return self;
}]);
